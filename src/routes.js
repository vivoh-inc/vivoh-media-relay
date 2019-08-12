const path = require('path');
const express = require('express');
const {sendBackPlaylistWhenReady} = require('./playlist');
const {convertPathToAddress} = require('./address');
const vivohMediaPlayers = require('vivoh-media-players');

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

  app.use('/player', express.static(path.join(__dirname, '..', 'assets')));

  app.get('/crossdomain.xml', (req, res) => {
    res.type('text/x-cross-domain-policy');
    res.send(`<?xml version="1.0" ?>
      <cross-domain-policy>
      <allow-access-from domain="*" />
      </cross-domain-policy>`);
  });

  app.get('/index.m3u8', (req, res) => {
    const address = req.query.s;
    sendBackPlaylistWhenReady({config, address, res});
  });

  app.get('/:path/index.m3u8', (req, res) => {
    const address = convertPathToAddress(req.params.path);
    sendBackPlaylistWhenReady({config, address, res});
  });
};
