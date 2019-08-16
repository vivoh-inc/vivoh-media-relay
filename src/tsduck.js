const { spawn } = require('child_process');
const psList = require('ps-list');
const tasklist = require('tasklist');
const ps = require('ps-node');
const path = require('path');
const processFilter = require('./process_filter');
const w = require('./output').write;
const o = require('./output');
const _config = require('./config');
const pids = {};

const fs = require('fs');

const isWindows = process.platform === 'win32';
const listProcesses = isWindows ? tasklist : psList;

// Under consideration, ignore this comment
let logFile = 'tsp.log';
const writeLog = m => {
  if (logFile) {
    date = new Date();
    fs.appendFile(logFile, `${date}:  ${m}`, err => {
      // console.error( "Unable to write to: ", logFile );
    }, `\n`);
  }
};

module.exports.name = 'tsduck';

module.exports.killTSDuckProcesses = _ => {
  console.debug("\nEntered tsduck:killTSDuckProcesses");
  const _pids = Object.values(pids);

  _pids.forEach(pid => {
    if (pid) {
      ps.kill(pid, err => {
        console.log('Error killing tsduck process:', err);
      });
    }
  });
};

module.exports.launchIfNecessary = function(config, dynamic) {
  console.debug("\nEntered tsduck:launchIfNecessary");
  return new Promise((resolve, reject) => {
    if (!(config && Object.keys(config).length != 0 && config.ipAddress)) {
      reject(new Error('Invalid arguments provided, internal error.'));
    }

    const { fixedDirectory, extras } = config;

    const { address } = dynamic;

    if (!fixedDirectory) {
      reject(new Error('Invalid directory, internal error: ' + fixedDirectory));
    } else {
      console.debug(`In tsduck.js:launchIfNecessary.  address: ${address}`);
      isTSDuckRunning(address).then(running => {
        if (running) {
          resolve(true);
        } else {
          if (
            launchTSDuck({
              extras,
              address,
              fixedDirectory
            })
          ) {
            resolve(true);
          } else {
            reject(new Error('Error launching tsduck'));
          }
        }
      });
    }
  });
};

const isTSDuckRunning = (module.exports.isRunning = address => {
  console.debug("\nEntered tsduck:isTSDuckRunning");
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

const getTSDuckBinary = () => {
  console.debug("\nEntered tsduck:getTSDuckBinary");
  if (process.platform === 'win32') {
    return 'tsp.exe';
  } else if (process.platform === 'darwin') {
    return 'tsp';
  } else if (process.platform === 'linux') {
    return 'tsp';
  }
};

const getArgumentsForTSDuck = (module.exports.getArgumentsForTSDuck = ({
  address,
  fixedDirectory = _config.DEFAULT_FIXED_DIRECTORY,
  extras
} = {}) => {
  console.log(`\nEntered tsduck.js:getArgumentsForTSDuck.\naddress=${address}\nfixedDirectory=${fixedDirectory}`);
  console.log(extras);//util.inspect(extras, {showHidden: false, depth: null}));
  if (!address) {
    return {};
  }
  console.log('About to define exe');
  const exe = (extras && extras.bin) || getTSDuckBinary();
  console.log(`exe=${exe}`);

  let args = ['-I', 'ip', address];

  if (extras && extras.extras) {
    console.log('Setting args');
    args = args.concat(extras.extras.split(' '));
    console.log('args:', args);
  } else {
    console.log('extras did not have any extras');
    //args = args.concat(['-codec', 'copy', '-hls_flags', 'delete_segments']);
    //args = args.concat(['-codec', 'copy', '-hls_flags', 'delete_segments']);
    console.log('About to update args');
    /*-I ip 239.0.0.1:1234 -O hls redirect-.ts -p redirect.m3u8*/
    args = args.concat(['-O', 'hls', path.join(fixedDirectory, 'redirect-.ts')]);
    args = args.concat(['-p', path.join(fixedDirectory, 'redirect.m3u8')]);
    // Set a duration.
    args = args.concat(['-d', 10]);
  }
  if (extras && extras.log) {
    logFile = extras.log;
  }
  
  //args.push(path.join(fixedDirectory, 'redirect.m3u8'));
  //writeLog(`tsduck with args: ${exe} ${args.join(' ')}\n`);

  return { args, exe };
});

const connectedStreams = {};

const launchTSDuck = (module.exports.launchTSDuck = tsduckConfig => {
  console.debug('\nEntered tsduck:launchTSDuck');
  const { args, exe } = getArgumentsForTSDuck(tsduckConfig);
  const { address } = tsduckConfig;

  if (!(exe && args)) {
    return false;
  } else {
    var fullCommand = `\n\ntsduck command: ${exe} ${args.join(' ')}\n\n`;
    if (args.includes('rtp://239.0.0.1:1234'))
    {
      args[args.indexOf('rtp://239.0.0.1:1234')] = '239.0.0.1:1234';
      console.debug(`Update args: ${args.join(' ')}`);
      fullCommand = `\n\ntsduck command: ${exe} ${args.join(' ')}\n\n`;
    }
    console.debug(fullCommand);
    // console.log(log);
    const tsduck = spawn(exe, args);
    tsduck.on('error', e => {
      console.error(e);
    });
    tsduck.stdout.on('data', data => {
      // if (!connectedStreams[address]) {
      //   connectedStreams[address] = true;
      // }
      // console.log(`TSDuck ${data}`);
    });
    tsduck.stderr.on('data', data => {
      console.debug(data);
    });
    tsduck.on('close', code => {
      console.debug(`TSDUCK close: ${code}`);
      connectedStreams[address] = false;
    });

    console.log('Connected to multicast stream:', address);

    pids[tsduckConfig.address] = tsduck.pid;

    w(o.startTSDuck());

    return true;
  }
});

module.exports.checkForTSDuck = config => {
  // Test for tsduck, use a fake address to get the args correctly.
  console.debug('\nEntered tsduck:checkForTSDuck');
  return new Promise((resolve, reject) => {
    // We seem to have an issue here if we use a fake address!
    console.debug('Caling getArgumentsForTSDuck');
    const { args, exe } = getArgumentsForTSDuck({ ...config, address: '239.0.0.1' });
    console.debug(`Returned from calling getArgumentsForTSDuck: ${exe}\n`);
    console.debug(`Returned from calling getArgumentsForTSDuck: ${args.join(' ')}\n`);
    const tsduck = spawn(exe, args);//, {detached: true});
    
    console.debug('Spawned tsduck object');//, tsduck);
    /*if (isTSDuckRunning && args.includes('x.x.x.x'))
    {
      console.debug('tsduck is running');  
      this.killTSDuckProcesses;
      tsduck.stdin.pause();
      tsduck.kill();
      console.debug('killed tsduck');
    }
    if (!args.includes('x.x.x.x'))*/
    //console.debug('tsduck spawned object now ', tsduck);
    /*tsduck.on('exit', (code, signal) => {
      console.log(`Exit on spawning tsduck.\ncode: ${code}\nsignal: ${signal}`);
      resolve();
    });
    tsduck.on('message', (message, sendHandle) => {
      console.log(`Message on spawning tsduck.\nmessage: ${message}\nsendHandle: ${sendHandle}`);
      resolve();
    });*/
    tsduck.on('error', _ => {
      console.log('Error spawning tsduck.');
      reject(exe);
    });
    tsduck.on('close', (code, signal) => {
      console.log(`Message on close on spawning tsduck: ${code}: ${signal}\n`);
      resolve();
    });
    tsduck.on('exit', (number, string) => {
      console.log(`Message on exit on spawning tsduck: ${number}: ${string}\n`);
      resolve();
    });
    tsduck.on('message', (message, sendHandle) => {
      console.log(`Message on spawning tsduck.\nmessage: ${message}\nsendHandle: ${sendHandle}`);
      resolve();
    });
  });
};

