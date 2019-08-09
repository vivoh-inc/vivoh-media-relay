const { spawn } = require('child_process');
const psList = require('ps-list');
const tasklist = require('tasklist');
const path = require('path');
const processFilter = require('./process_filter');
const w = require('./output').write;
const o = require('./output');
const _config = require('./config');
const pids = {};

const fs = require('fs');

const isWindows = process.platform === 'win32';
const listProcesses = isWindows ? tasklist : psList;

let logFile = undefined;
const writeLog = m => {
  if (logFile) {
    fs.appendFile(logFile, m, err => {
      // console.error( "Unable to write to: ", logFile );
    });
  }
};

module.exports.name = 'ffmpeg';

module.exports.launchIfNecessary = function(config, dynamic) {
  return new Promise((resolve, reject) => {
    if (!(config && Object.keys(config).length != 0 && config.ipAddress)) {
      reject(new Error('Invalid arguments provided, internal error.'));
    }

    const { fixedDirectory, extras } = config;

    const { address } = dynamic;

    if (!fixedDirectory) {
      reject(new Error('Invalid directory, internal error: ' + fixedDirectory));
    } else {
      isFfmpegRunning(address).then(running => {
        if (running) {
          resolve(true);
        } else {
          if (
            launchFfmpeg({
              extras,
              address,
              fixedDirectory
            })
          ) {
            resolve(true);
          } else {
            reject(new Error('Error launching ffmpeg'));
          }
        }
      });
    }
  });
};

const isFfmpegRunning = (module.exports.isRunning = address => {
  return new Promise((resolve, reject) => {
    const pid = pids[address];
    listProcesses()
      .then(processes => {
        resolve(processFilter.pidIsRunning(processes, pid));
      })
      .catch(err => {
        console.log('We got an error: ', err);
        reject(err);
      });
  });
});

const getFfmpegBinary = () => {
  if (process.platform === 'win32') {
    return 'ffmpeg.exe';
  } else if (process.platform === 'darwin') {
    return 'ffmpeg';
  } else if (process.platform === 'linux') {
    return 'ffmpeg';
  }
};

const getArgumentsForFfmpeg = (module.exports.getArgumentsForFfmpeg = ({
  address,
  fixedDirectory = _config.DEFAULT_FIXED_DIRECTORY,
  extras
} = {}) => {
  if (!address) {
    return {};
  }

  const exe = (extras && extras.bin) || getFfmpegBinary();
  let args = ['-i', address];

  if (extras && extras.extras) {
    args = args.concat(extras.extras.split(' '));
  } else {
    args = args.concat(['-codec', 'copy', '-hls_flags', 'delete_segments']);
  }
  if (extras && extras.log) {
    logFile = extras.log;
  }

  args.push(path.join(fixedDirectory, 'redirect.m3u8'));
  return { args, exe };
});

const launchFfmpeg = (module.exports.launchFfmpeg = ffmpegConfig => {
  const { args, exe } = getArgumentsForFfmpeg(ffmpegConfig);

  if (!(exe && args)) {
    return false;
  } else {
    const fullCommand = `\n\nffmpeg command: ${exe} ${args.join(' ')}\n\n`;

    writeLog(fullCommand);
    // console.log(log);
    const ffmpeg = spawn(exe, args);
    ffmpeg.on('error', e => {
      writeLog(e);
    });
    ffmpeg.stdout.on('data', data => {
      // console.log(`FFMPEG： ${data}`);
    });
    ffmpeg.stderr.on('data', data => {
      writeLog(data);
    });
    ffmpeg.on('close', code => {
      writeLog(`FFMPEG close: ${code}`);
    });

    pids[ffmpegConfig.address] = ffmpeg.pid;

    w(o.startFfmpeg());

    return true;
  }
});

module.exports.checkForFfmpeg = config => {
  // Test for ffmpeg, use a fake address to get the args correctly.
  return new Promise((resolve, reject) => {
    const { exe } = getArgumentsForFfmpeg({ ...config, address: 'x.x.x.x' });
    const ffmpeg = spawn(exe);
    ffmpeg.on('error', _ => {
      reject(exe);
    });
    ffmpeg.on('close', _ => {
      resolve();
    });
  });
};
