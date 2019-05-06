const path = require('path');
const express = require('express');
const {sendBackPlaylistWhenReady} = require('./playlist');
const vivohMediaPlayers = require('vivoh-media-players');

module.exports.setupRoutes = ({type, app, config}) => {
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
  });

  app.get('/pid/:pid', (req, res) => {
    const {pid} = req.params;
    console.log('params:', req.params);
    respondWithProgram(res, pid);
  });

  app.get(`/${type}.html`, (req, res) => {
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
    sendBackPlaylistWhenReady(config, address, res);
  });
};
