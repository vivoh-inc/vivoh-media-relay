const express = require('express');
const http = require('http');
const https = require('https');
const axios = require('axios');
const o = require('./output');
const w = require('./output').write;
const { setupRoutes } = require('./routes');
const {DEFAULT_POLLING_TIME} = require('./config');
const {serverStatus} = require('./server_status');

let app;
let server;

module.exports.run = (config,
    {_checkPollServerForStatus, _startServer} =
    {_checkPollServerForStatus: checkPollServerForStatus,
      _startServer: startServer }) => {
  if (config.poll && config.poll.url) {
    o.write('POLL'.bold + ' (timeout ' + config.poll.time + ' secs)\n');
  }

  if (config.poll && config.poll.url) {
    _checkPollServerForStatus(config);
  } else {
    _startServer(config);
  }
};

const startServer = module.exports.startServer = (config) => {
  if (!app) {
    if (server) {
      console.log( "Closing existing server");
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

    if (config.credentials) {
      server = https
        .createServer(config.credentials, app)
        .listen(config.port, config.ipAddress);
    } else {
      o.write(`Starting server: ${config.ipAddress}:${config.port}\n`);
      server = http
        .createServer(app)
        .listen(config.port, config.ipAddress); // , () => { console.log( "We are on!")});
    }

    serverStatus.on = true;
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
    app = undefined;
    server = undefined;
    console.log( "Server stopped.");
  }
  serverStatus.on = false;
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
    .get(config.poll.url)
    .then(response => {
      if (response.data) {
        const dynamic = _processResponse(response);
        if (dynamic) {
          isOn = dynamic.isOn;
          if (isOn) {
            w(o.pollServerOn());
            const carefullyMerged = {...config};
            Object.keys(dynamic).forEach( k => {
              if (dynamic[k]) { 
                carefullyMerged[k] = dynamic[k] 
              };
            });
            _startServer(carefullyMerged);
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
      console.log( "Got an error: ", error );
      w(o.pollServerFailure(error));
      _stopServer();
    });

  _setTimeout(() => {
    checkPollServerForStatus(config);
  }, (config.poll.time || DEFAULT_POLLING_TIME) * 1000);
};
