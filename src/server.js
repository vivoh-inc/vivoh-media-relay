const express = require('express');
const http = require('http');
const https = require('https');
const axios = require('axios');
const o = require('./output');
const w = require('./output').write;
const { setupRoutes } = require('./routes');

let app;
let server;

module.exports.run = (config,
    {_checkPollServerForStatus, _startServer} =
    {_checkPollServerForStatus: checkPollServerForStatus,
      _startServer: startServer }) => {
  if (config.pollUrl) {
    console.log('POLL'.bold + ' (timeout ' + config.pollTime + ' secs)');
  }

  if (config.pollUrl) {
    _checkPollServerForStatus(config);
  } else {
    _startServer(config);
  }
};

const startServer = module.exports.startServer = (config) => {
  if (!app) {
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

    if (config.credentials) {
      server = https
        .createServer(config.credentials, app)
        .listen(config.port, config.ipAddress);
    } else {
      server = http.createServer(app).listen(config.port, config.ipAddress);
    }
  }
};

const processResponse = module.exports.processReponse = (response) => {
  let{ isOn = false, redirect = false, url, port, flags, credentials} = {};
  if (typeof response.data === 'object') {
    if (response.data.on) {
      isOn = true;
      redirect = 'redirect' === response.data.type;
      url = response.data.source;
      port = response.data.port;
      flags = response.data.flags;
      credentials = response.data.credentials;
    }
  } else if (0 === response.data.indexOf('on')) {
    isOn = true;
  }
  return { isOn, redirect, url, port, flags, credentials};
}


const stopServer = module.exports.stopServer = () => {
  if (app && server) {
    server.close();
    w(o.stopServer());
    console.log(`\nShutting down server\n`);
  }
  app = undefined;
  server = undefined;
};

const checkPollServerForStatus =
  module.exports.checkPollServerForStatus = (config,
    // These lines are only overriden inside tests
    {_axios, _setTimeout, _processResponse, _startServer, _stopServer} =
    { _axios: axios,
      _setTimeout: setTimeout,
      _processResponse: processResponse,
      _startServer: startServer,
      _stopServer: stopServer } ) => {

    _axios
    .get(config.pollUrl)
    .then(response => {
      if (response.data) {
        const dynamic = _processResponse(response);
        if (dynamic) {
          isOn = dynamic.isOn;
          if (isOn) {
            w(o.pollServerOn());
            _startServer({...config, ...dynamic});
          } else {
            w(o.pollServerOff());
            _stopServer();
          }
        }
        else {
          w(o.pollServerOff());
          _stopServer();
        }
      }
    })
    .catch(error => {
      w(o.pollServerFailure(error));
    });

  _setTimeout(() => {
    checkPollServerForStatus(config);
  }, config.pollTime * 1000);
};
