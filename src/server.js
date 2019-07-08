const o = require('./output');
const w = require('./output').write;
const express = require('express');
const {setupRoutes} = require('./routes');
const http = require('http');
const https = require('https');

let app;

module.exports.run = (config) => {
  startServer(config);
};

const startServer = (module.exports.startServer = (config) => {
  if (!app) {
    w(o.startServer());
    app = express();
    setupRoutes({app, type: config.type, config});
    app.use(
        express.static(config.fixedDirectory, {
          setHeaders: (res, path, stat) => {
            res.set('Access-Control-Allow-Origin', '*');
          },
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
});
