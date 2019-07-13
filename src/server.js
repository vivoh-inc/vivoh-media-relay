const o = require('./output');
const w = require('./output').write;
const express = require('express');
const { setupRoutes } = require('./routes');
const http = require('http');
const https = require('https');

let app;

module.exports.run = (config,
    {_checkPollServerForStatus = checkPollServerForStatus,
    _startServer = startServer}) => {
  if (config.pollUrl) {
    console.log('POLL'.bold + ' (timeout ' + config.pollTime + 'secs)');
  }

  if (config.pollUrl) {
    _checkPollServerForStatus();
  } else {
    _startServer(config);
  }
};

const startServer = module.exports.startServer = config => {
  if (!app) {
    w(o.startServer());
    app = express();
    setupRoutes({ app, type: config.type, config });
    app.use(
      express.static(config.fixedDirectory, {
        setHeaders: (res, _, __) => {
          res.set('Access-Control-Allow-Origin', '*');
        }
      })
    );

    console.log('port, ip', config.port, config.ipAddress);

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

const checkPollServerForStatus = (config,
  {_axios, _setTimeout} = { _axios: axios, _setTimeout: setTimeout } ) => {
  _axios
    .get(config.pollUrl)
    .then(response => {
      if (response.data) {
        const dynamic = processResponse(response);

        isOn = dynamic.isOn;
        if (isOn) {
          w(o.pollServerOn());
          startServer({...config, ...dynamic});
        } else {
          w(o.pollServerOff());
          stopServer();
        }
      }
    })
    .catch(error => {
      w(o.pollServerFailure());
    });

  _setTimeout(() => {
    checkPollServerForStatus();
  }, pollTime * 1000);
};
