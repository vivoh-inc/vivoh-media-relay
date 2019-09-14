const path = require('path');
const express = require('express');
const {sendBackPlaylistWhenReady} = require('./playlist');
const {convertPathToAddress, getAddress} = require('./address');
const vivohMediaPlayers = require('vivoh-media-players');
const ip = require('ip');
const {isRunning} = require('./ffmpeg');
const { getProgram } = require('./programs');

let currentAddress;

module.exports.setupRoutes = ({type = 'hls', app, config}) => {
  app.use((_, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.set('Access-Control-Allow-Origin', '*');
    next();
  });

  app.get(`/${type}.html`, (_, res) => {
    const fullPath = path.resolve(vivohMediaPlayers[type].playerPath());
    res.sendFile(fullPath);
  });
  
  app.get('/data*', (req, res) => {
    isRunning(currentAddress).then( (ffmpegOn) => {
      res.json({
        Version: '1.3.4', 
        VersionUpdated: '2019-08-29',
        Status: 'OK', 
        IPAddress: ip.address(), 
        FFmpegIsOn:  (ffmpegOn ? 'on' : 'off')}
      );
    });
  });

  app.get('/status*', (req, res) => {
    isRunning(currentAddress).then( (ffmpegOn) => {
      res.send(`
      <html>
      <body>
      <div>Status: OK</div>
      <div>Your IP Address: ${ip.address()}</div>
      <div>FFmpeg is: ${ffmpegOn ? 'on' : 'off'}</div>
      </body>
      </html>
      
      `);
    });
  });

  app.use('/player', express.static(path.join(__dirname, '..', 'assets')));

  app.get('/crossdomain.xml', (_, res) => {
    res.type('text/x-cross-domain-policy');
    res.send(`<?xml version="1.0" ?>
      <cross-domain-policy>
      <allow-access-from domain="*" />
      </cross-domain-policy>`);
  });

  app.get('/index.m3u8', (req, res) => {
    let address = (currentAddress = getAddress(req.originalUrl));
    if (req.params.pid) {
      address = getProgram(req.query.pid);
      console.log( "Address is:", address );
    }

    sendBackPlaylistWhenReady({config, address, res});
  });

  app.get('/:path/index.m3u8', (req, res) => {
    let address = (currentAddress = convertPathToAddress(req.params.path));
    if (req.params.pid) {
      address = getProgram(req.query.pid);
      console.log( "Address is:", address );
    }
    sendBackPlaylistWhenReady({config, address, res});
  });
};
