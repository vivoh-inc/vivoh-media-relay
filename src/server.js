const express = require('express');
const http = require('http');
const https = require('https');
const axios = require('axios');
const o = require('./output');
const w = require('./output').write;
const { setupRoutes } = require('./routes');
const { killFfmpegProcesses, launchIfNecessary } = require('./ffmpeg');
const { DEFAULT_POLLING_TIME } = require('./config');
const { serverStatus } = require('./server_status');

let app;
let server;

module.exports.run = (
  config,
  { _checkPollServerForStatus, _startServer } = {
    _checkPollServerForStatus: checkPollServerForStatus,
    _startServer: startServer
  }
) => {
  if (config.poll && config.poll.url) {
    o.write('POLL'.bold + ' (timeout ' + config.poll.time + ' secs)\n');
  }

  if (config.poll && config.poll.url) {
    _checkPollServerForStatus(config);
  } else {
    _startServer(config);
  }
};

const startServer = (module.exports.startServer = config => {
  if (!app) {
    if (server) {
      console.log('Closing existing server');
      server.close();
    }

    w(o.startServer());
    app = express();
    setupRoutes({ app, type: 'hls', config });
    app.use(
      express.static(config.fixedDirectory, {
        setHeaders: (res, _, __) => {
          res.set('Access-Control-Allow-Origin', '*');
        }
      })
    );

    app.get('/:path/:tsFile', function(req, res) {
      path = req.params.tsFile;
      res.sendFile(path, { root: config.fixedDirectory });
    });

    if (config.credentials) {
      server = https
        .createServer(config.credentials, app)
        .listen(config.port, config.ipAddress)
        .on('error', notifyListenError);
    } else {
      o.write(`\n\nStarting server: ${config.ipAddress}:${config.port}\n\n`);
      server = http
        .createServer(app)
        .listen(config.port, config.ipAddress)
        .on('error', notifyListenError); // , () => { console.log( "We are on!")});
    }

    serverStatus.on = true;
  }
});

const notifyListenError = () => {
  console.log('An error occurred, is the server already running?');
};

const processResponse = (module.exports.processReponse = response => {
  let { isOn = false, redirect = false, url, port, flags, credentials, programId, mcastUrl, startDateTime, endDateTime, pollInterval } = {};
  if (typeof response.data === 'object') {
    if (response.data.on) {
      isOn = true;
      redirect = 'redirect' === response.data.type;
      url = response.data.url;
      source = response.data.source;
      port = response.data.port;
      flags = response.data.flags;
      credentials = response.data.credentials;
      programId = response.data.programId;
      mcastUrl = response.data.mcastUrl;
      startDateTime = response.data.startDateTime;
      endDateTime = response.data.endDateTime;
      pollInterval = response.data.pollInterval;
    }
  } else if (0 === response.data.indexOf('on')) {
    isOn = true;
  }

  return { isOn, redirect, url, port, flags, credentials,  programId, mcastUrl, startDateTime, endDateTime, pollInterval  };
});

const stopServer = (module.exports.stopServer = () => {
  if (app && server) {
    server.close();
    w(o.stopServer());
    app = undefined;
    server = undefined;
    console.log('\n\nServer stopped.\n\n');
    killFfmpegProcesses();
  }
  serverStatus.on = false;
});

const checkPollServerForStatus = (module.exports.checkPollServerForStatus = (
  config,
  // These lines are only overriden inside tests
  { _axios, _setTimeout, _processResponse, _startServer, _stopServer, _loop } = {
    _axios: axios,
    _setTimeout: setTimeout,
    _processResponse: processResponse,
    _startServer: startServer,
    _stopServer: stopServer,
    _loop: true,
  }
) => {
  const promise = _axios
    .get(config.poll.url)
    .then(response => {
      if (response.data) {
        const dynamic = _processResponse(response);
        if (dynamic) {
          isOn = dynamic.isOn;
          if (isOn) {
            w(o.pollServerOn());
            const carefullyMerged = { ...config };
            Object.keys(dynamic).forEach(k => {
              if (dynamic[k]) {
                carefullyMerged[k] = dynamic[k];
              }
            });
            _startServer(carefullyMerged);

            if (hasProgram(carefullyMerged)) {
              const dynamic = convertCarefullyMergedToDynamic(carefullyMerged);
              config.segmenter.launchIfNecessary(config, dynamic);
            }
          } else {
            w(o.pollServerOff());
            config.segmenter.killFfmpegProcesses();
            _stopServer();
          }
        } else {
          w(o.pollServerOff());
          _stopServer();
          config.segmenter.killFfmpegProcesses();
        }
      }
    })
    .catch(error => {
      // console.log( "Got an error: ", error );
      w(o.pollServerFailure(error));
      _stopServer();
    });

  if (_loop) {
    _setTimeout(() => checkPollServerForStatus(config),
      (config.poll.time || DEFAULT_POLLING_TIME) * 1000);
  } else {
    return promise;
  }
});

const convertCarefullyMergedToDynamic = (merged) => {
  const dynamic = {};
  dynamic.address = merged.mcastUrl;
  return dynamic;
}

const hasProgram = module.exports.hasProgram = config => {
  return (config.mcastUrl && config.programId);
}
