const express = require('express');
const http = require('http');
const si = require('systeminformation');
const https = require('https');
const axios = require('axios');
const os = require('os');
const o = require('./output');
const { setupRoutes } = require('./routes');
const { DEFAULT_POLLING_TIME } = require('./config');
const { serverStatus } = require('./server_status');
const version= require('./version').version;

let app;
let server;

axios.defaults.headers['X_VMR_CLIENT_VERSION'] = version;

module.exports.run = (
  config,
  { _checkPollServerForStatus, _startServer } = {
    _checkPollServerForStatus: checkPollServerForStatus,
    _startServer: startServer
  }
) => {
  if (config.poll && config.poll.url) {
    o.poll( config.poll ); // ('POLL'.bold + ' (timeout ' + config.poll.time + ' secs)\n');
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
      // o.server({on: false});
      // console.log('Closing existing server');
      server.close();
    }
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
      const path = req.params.tsFile;
      res.sendFile(path, { root: config.fixedDirectory });
    });

    app.get('/:path/:programId/:tsFile', function(req, res) {
      const path = req.params.tsFile;
      const programId = req.params.programId;
      res.sendFile(path, { root: path.join(config.fixedDirectory, programId) });
    });

    if (config.credentials) {
      server = https
        .createServer(config.credentials, app)
        .listen(config.port, config.ipAddress, () => o.server( { on: true, config } ))
        .on('error', notifyListenError);
    } else {
      server = http
        .createServer(app)
        .listen(config.port, config.ipAddress, () => o.server( { on: true, config } ) )
        .on('error', notifyListenError);
    }

    o.server( { on: true, config });
    serverStatus.on = true;
  }
});

const notifyListenError = () => {
  o.errors('An error occurred, is the server already running?');
};

const processResponse = (module.exports.processReponse = response => {
  let { on = false, port, credentials, programs, pollInterval, redirect } = {};
  if (typeof response.data === 'object') {
    if (response.data) {
      port = response.data.port;
      credentials = response.data.credentials;
      programs = response.data.programs;
      pollInterval = response.data.pollInterval;
      on = response.data.on;
      redirect = response.data.type === 'redirect';
    }
  } else if (0 === response.data.indexOf('on')) {
    on = true;
  }

  return { on, port, credentials, programs, pollInterval, redirect  };
});

const stopServer = (module.exports.stopServer = (config) => {
  if (app && server) {
    server.close();
    app = undefined;
    server = undefined;
    o.server({on:false});
    config.segmenter.killProcesses();
  }
  serverStatus.on = false;
});

const checkPollServerForStatus = (module.exports.checkPollServerForStatus = (
  config,
  // These lines are only overriden inside tests
  { _axios, _setTimeout, _processResponse, _startServer, _stopServer, _loop, _si } = {
    _axios: axios,
    _si: si,
    _setTimeout: setTimeout,
    _processResponse: processResponse,
    _startServer: startServer,
    _stopServer: stopServer,
    _loop: true,
  }
) => {

  const hostname = process.env.VMR_HOSTNAME || os.hostname();
  const requestObj = ( config.poll.systemInformation ?
      Promise.all( [
        _si.cpu(),
        _si.mem(),
        _si.currentLoad(),
        _si.services('ffmpeg'),
        _si.networkInterfaces(),
        _si.networkStats(), ] )
      .then( ([ cpu, mem, load, ffmpeg, interfaces, network ]) =>
        _axios.post(config.poll.url, { systemInformation: { hostname, cpu, mem, load, ffmpeg, interfaces, network } } ) ) :
      _axios.get(config.poll.url) );

  const promise = requestObj
    .then(response => {
      if (response.data) {
        const dynamic = _processResponse(response);
        if (dynamic) {
          o.poll( { response: dynamic });
          o.message('Poll server request successful');
          on = dynamic.on;
          if (on) {
            o.poll({on: true});
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
            o.poll({on: false});
            config.segmenter.killProcesses();
            _stopServer(config);
          }
        } else {
          _stopServer(config);
          config.segmenter.killFfmpegProcesses();
        }
      }
    })
    .catch(error => {
      o.poll({error});
      _stopServer(config);
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
  dynamic.programs = merged.programs;
  dynamic.on = merged.on;
  return dynamic;
}

const hasProgram = module.exports.hasProgram = config => {
  return (config.programs && config.programs.length > 0);
}
