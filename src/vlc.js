const {spawn} = require('child_process');
const fixUdpAddressForVlc = (address) => address.replace('udp://', 'udp://@');
const psList = require('ps-list');
const processFilter = require('./process_filter');
const w = require('./output').write;
const o = require('./output');

// master pid for vlc
const pids = {};

module.exports.name = 'vlc';

module.exports.launchIfNecessary = (config, { address }) => {
  const {
    fixedDirectory,
    extras,
    ipAddress,
    port,
  } = config;
  return new Promise((resolve, reject) => {
    isVlcRunning(address).then((running) => {
      if (running) {
        resolve(true);
      } else {
        const args = [
          fixUdpAddressForVlc(address),
          '--sout',
          generateSout(ipAddress, fixedDirectory, port, extras.vlcExtras),
        ];

        if (process.platform === 'darwin') {
          args.unshift('-I', 'rc');
        }

        const exe = (extras && extras.vlcBin) || getCvlc();
        const vlc = spawn(exe, args);
        vlc.on('error', (e) => {
          console.log(e);
        });

        vlc.stdout.on('data', (data) => {
          // console.log(`VLC： ${data}`);
        });

        vlc.stderr.on('data', (data) => {
          // console.log(`VLC： ${data}`);
        });

        vlc.on('close', (code) => {
          console.log('VLC close', code);
        });

        pids[address] = vlc.pid;

        w(o.startVlc());

        resolve(true);
      }
    });
  });
};

const isVlcRunning = (module.exports.isRunning = (address) => {
  return new Promise((resolve, reject) => {
    const pid = pids[address];
    psList()
        .then((processes) => {
          resolve(processFilter.pidIsRunning(processes, pid));
        })
        .catch((err) => reject(err));
  });
});

const getCvlc = () => {
  if (process.platform === 'windows') {
    return 'vlc.exe';
  } else if (process.platform === 'darwin') {
    return '/Applications/VLC.app/Contents/MacOS/VLC';
  } else if (process.platform === 'linux') {
    return 'cvlc';
  }
};

const generateSout = (ipAddress, directory, port = 8888, argv = {}) => {
  const config = {};
  const defaults = {seglen: 5, delsegs: 'false', numsegs: 5};
  let printToConfirm = false;
  Object.keys(defaults).forEach((k) => {
    if (argv[`vlc-${k}`]) {
      printToConfirm = true;
      config[k] = argv[`vlc-${k}`];
    } else {
      config[k] = defaults[k];
    }
  });

  const extras =
    `#std{access=livehttp{seglen=${config.seglen},` +
    `delsegs=${config.delsegs},numsegs=${config.numsegs}, ` +
    `index=${directory}/redirect.m3u8, ` +
    `index-url=http://${ipAddress}:${port}/chunks-########.ts}, ` +
    `mux=ts{use-key-frames}, dst=${directory}/chunks-########.ts}}`;

  if (printToConfirm) {
    console.log('VLC extras: ', extras);
  }

  return extras;
};
