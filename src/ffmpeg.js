const {spawn} = require('child_process');
const psList = require('ps-list');
const tasklist = require('tasklist');
const ps = require('ps-node');
const path = require('path');
const processFilter = require('./process_filter');
const o = require('./output');
const _config = require('./config');
const pids = {};

const fs = require('fs');

const isWindows = process.platform === 'win32';
const listProcesses = isWindows ? tasklist : psList;

let logFile = undefined;
const writeLog = (m) => {
  if (logFile) {
    fs.appendFile(logFile, m, (err) => {
      // console.error( "Unable to write to: ", logFile );
    });
  }
};

module.exports.name = 'ffmpeg';

module.exports.killProcesses = (_) => {
  const _urls = Object.keys(pids);

  const killed = [];
  _urls.forEach((url) => {
    const pid = pids[url];
    if (pid) {
      console.log('Killing ffmpeg pid: ', pid);
      ps.kill(pid, (err) => {
        if (err) {
          o.errors('Error killing ffmpeg process');
        } else {
          killed.push(pid);
          o.updateSegmenter(url, {status: 'off'});
        }
      });
    }
  });

  killed.forEach((k) => {
    delete pids[k];
  });
};

module.exports.launchIfNecessary = function(config, dynamic,
    {_launchFfmpeg, _isFfmpegRunning} = {_launchFfmpeg: launchFfmpeg, _isFfmpegRunning: isFfmpegRunning}) {
  const {fixedDirectory, extras} = config;
  const {programs} = dynamic;

  const emptyPromise = new Promise( (resolve) => resolve());

  if (!(config && Object.keys(config).length != 0 && config.ipAddress)) {
    // throw new Error('Invalid arguments provided, internal error.');
    return emptyPromise;
  }

  if (!fixedDirectory) {
    return emptyPromise;
    // throw new Error('Invalid directory, internal error: ' + fixedDirectory);
  }

  const promises = [];

  if (!programs || programs.length <= 0) {
    if (dynamic.type !== 'redirect') {
      promises.push(getFfmpegPromise( {url: dynamic.url, fixedDirectory, extras, _launchFfmpeg, _isFfmpegRunning}));
    }
  } else {
    programs.forEach((p) => {
      if (p.type !== 'redirect') {
        const promise = getFfmpegPromise({...p, extras, fixedDirectory, _isFfmpegRunning, _launchFfmpeg});
        promises.push(promise);
      }
    });
  }

  return Promise.all(promises);
};

const getFfmpegPromise = ( {url, extras, programId, fixedDirectory, _isFfmpegRunning, _launchFfmpeg}) => {
  return _isFfmpegRunning(url).then((running) => {
    if (running) {
      o.updateSegmenter( url, {status: 'on'});
    } else {
      o.updateSegmenter( url, {status: 'starting'});
      if (!_launchFfmpeg({extras, url,
        fixedDirectory, programId})
      ) {
        o.updateSegmenter( url, {status: 'failed'});
      }
    }
  });
};

const isFfmpegRunning = (module.exports.isRunning = (url) => {
  return new Promise((resolve, reject) => {
    const pid = pids[url];
    listProcesses()
        .then((processes) => {
          resolve(processFilter.pidIsRunning(processes, pid));
        })
        .catch((err) => {
          e.errors('We got an error with ffmpeg');
          o.errors('We got an error with ffmpeg');
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
  url,
  programId,
  fixedDirectory = _config.DEFAULT_FIXED_DIRECTORY,
  extras,
} = {}) => {
  if (!url) {
    return {};
  }

  const exe = (extras && extras.bin) || getFfmpegBinary();
  let args = ['-i', url];

  if (extras && extras.extras) {
    args = args.concat(extras.extras.split(' '));
  } else {
    args = args.concat(['-codec', 'copy', '-hls_flags', 'delete_segments']);
  }
  if (extras && extras.log) {
    logFile = extras.log;
  }

  const fullPath = [fixedDirectory];
  if (programId) {
    fullPath.push(`${programId}`);
    const pathRelative = path.join(...fullPath);
    if (!fs.existsSync(pathRelative)) {
      fs.mkdirSync(pathRelative);
    }
  }
  fullPath.push('redirect.m3u8');
  args.push(path.join(...fullPath));
  return {args, exe};
});

const connectedStreams = {};

const launchFfmpeg = (module.exports.launchFfmpeg = (ffmpegConfig) => {
  const {args, exe} = getArgumentsForFfmpeg(ffmpegConfig);
  const {url} = ffmpegConfig;

  if (!(exe && args)) {
    o.errors('Invalid arguments');
    return false;
  } else {
    const fullCommand = `\n\nffmpeg command: ${exe} ${args.join(' ')}\n\n`;

    writeLog(fullCommand);
    const ffmpeg = spawn(exe, args);
    ffmpeg.on('error', (e) => {
      writeLog(e);
    });
    ffmpeg.stdout.on('data', (_) => {
      // if (!connectedStreams[address]) {
      //   connectedStreams[address] = true;
      // }
      // console.log(`FFMPEG： ${data}`);
    });
    ffmpeg.stderr.on('data', (data) => {
      writeLog(data);
    });
    ffmpeg.on('close', (code) => {
      writeLog(`FFMPEG close: ${code}`);
      connectedStreams[url] = false;
    });

    o.message('Connected to multicast stream: ' + url);
    pids[url] = ffmpeg.pid;
    o.updateSegmenter(url, {status: 'starting'});
    return true;
  }
});

module.exports.checkForBinary = (config) => {
  // Test for ffmpeg, use a fake address to get the args correctly.
  return new Promise((resolve, reject) => {
    const {exe} = getArgumentsForFfmpeg({...config, url: 'x.x.x.x'});
    const ffmpeg = spawn(exe);
    ffmpeg.on('error', (_) => {
      reject(exe);
    });
    ffmpeg.on('close', (_) => {
      resolve();
    });
  });
};
