const path = require('path');
const fs = require('fs');
const dirUtils = require('./dir_utils');
const mime = require('./mime');
const o = require('./output');
const {serverStatus} = require('./server_status');
const RETRY_MAX = 60;

module.exports.setConfig = (cfg) => config = cfg;

const sendRedirectFile =
  module.exports.sendRedirectFile = (fixedDirectory, res) => {
    const redirect = path.join(fixedDirectory, 'redirect.m3u8');
    const contents = fs.readFileSync(redirect).toString();
    res.set('Content-Type', mime.M3U8_MIME);
    res.send(contents);
  };


const ifTsFilesAreReadyThenSend =
  module.exports.ifTsFilesAreReadyThenSend =
    ({config, url, res, index = 0}) => {
      dirUtils
          .isReadyToView(config.fixedDirectory)
          .then( (ready) => {
            if (ready) {
              o.updateSegmenter(url, {status: 'ready'});
              sendRedirectFile(config.fixedDirectory, res);
            } else {
              if (index < RETRY_MAX) {
                setTimeout(() => {
                  ifTsFilesAreReadyThenSend(
                      {config, url, res,
                        index: index + 1});
                }, 1000);
                o.updateSegmenter(url, {status: 'holding'});
              } else {
                res.send('Error, timed out.');
              }
            }
          })
          .catch((err) => {
            o.errors('Error: ' + err.toString());
            throw err;
          });
    };

module.exports.sendBackPlaylistWhenReady = ({config, url, res}) => {
  if (url) {
    config.segmenter.launchIfNecessary(config, {url}).then((_) => {
      ifTsFilesAreReadyThenSend({config, url, res});
    });
  }
};
