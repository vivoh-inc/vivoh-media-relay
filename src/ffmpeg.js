const {spawn} = require('child_process');
const psList = require('ps-list');
const path = require('path');
const processFilter = require('./process_filter');
const w = require('./output').write;
const o = require('./output');
const {getAppAndStreamFromAddress} = require('./address');
// master pid for ffmpeg
const pids = {};

const fs = require('fs');

let logFile = undefined;
const writeLog = (m) => {
  if (logFile) {
    fs.appendFile(logFile, m, (err) => {
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

    const {
      type,
      fixedDirectory,
      dontAddAacSwitches = false,
      extras,
      rtmpPort,
      flags,
    } = config;

    const {address} = dynamic;

    const useHls = 'hls' === type;

    if (useHls && !fixedDirectory) {
      reject(
          new Error(
              'Invalid HLS, need directory, internal error: ' + fixedDirectory
          )
      );
    } else {
      isFfmpegRunning(address).then((running) => {
        if (running) {
          resolve(true);
        } else {
          if (
            launchFfmpeg({
              extras,
              address,
              useHls,
              fixedDirectory,
              dontAddAacSwitches,
              rtmpPort,
              flags,
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

const isFfmpegRunning = (module.exports.isRunning = (address) => {
  return new Promise((resolve, reject) => {
    const pid = pids[address];
    psList()
        .then((processes) => {
          resolve(processFilter.pidIsRunning(processes, pid));
        })
        .catch((err) => reject(err));
  });
});

const getFfmpegBinary = () => {
  if (process.platform === 'windows') {
    return 'ffmpeg.exe';
  } else if (process.platform === 'darwin') {
    return 'ffmpeg';
  } else if (process.platform === 'linux') {
    return 'ffmpeg';
  }
};

const getArgumentsForFfmpeg = module.exports.getArgumentsForFfmpeg = ({
  address,
  useHls,
  fixedDirectory,
  rtmpPort,
  flags,
  dontAddAacSwitches = false,
  extras,
  source,
} = {}) => {
  if (!address) {
    return {};
  }

  const {app, stream} = getAppAndStreamFromAddress(address);

  const exe = (extras && extras.ffmpegBin) || getFfmpegBinary();
  let ffArgs = ['-i', address];

  if (extras && extras.extras) {
    ffArgs = ffArgs.concat(extras.extras.split(' '));
  }
  if (extras && extras.log) {
    logFile = extras.log;
  }

  if (useHls) {
    if (flags) {
      ffArgs = ffArgs.concat(flags.split(' '));
    } else {
      ffArgs = ffArgs.concat(
          ['-codec', 'copy', '-hls_flags', 'delete_segments'],
          path.join(fixedDirectory, 'redirect.m3u8')
      );
    }
  } else {
    if (flags) {
      ffArgs = ffArgs.concat(flags.split(' '));
    } else {
      ffArgs = ffArgs.concat(['-c', 'copy', '-f', 'flv']);
      if (!dontAddAacSwitches) {
        ffArgs = ffArgs.concat('-bsf:a', 'aac_adtstoasc');
      }
    }

    const url = source
      ? source
      : `rtmp://localhost${rtmpPort ? ':' + rtmpPort : ''}/${app}/${stream}`;
    ffArgs = ffArgs.concat(url);
  }

  return {args: ffArgs, exe};
};

const launchFfmpeg = (module.exports.launchFfmpeg = (ffmpegConfig) => {
  const {args, exe} = getArgumentsForFfmpeg(ffmpegConfig);

  if (!(exe && args)) {
    return false;
  } else {
    const fullCommand = `\n\nffmpeg command: ${exe} ${args.join(' ')}\n\n`;

    writeLog(fullCommand);
    // console.log(log);
    const ffmpeg = spawn(exe, args);
    ffmpeg.on('error', (e) => {
      writeLog(e);
    });
    ffmpeg.stdout.on('data', (data) => {
      // console.log(`FFMPEG： ${data}`);
    });
    ffmpeg.stderr.on('data', (data) => {
      writeLog(data);
    });
    ffmpeg.on('close', (code) => {
      writeLog(`FFMPEG close: ${code}`);
    });

    pids[ffmpegConfig.address] = ffmpeg.pid;

    w(o.startFfmpeg());

    return true;
  }
});
