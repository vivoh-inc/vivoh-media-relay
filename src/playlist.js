const path = require('path');
const fs = require('fs');
const dirUtils = require('./dir_utils');
const mime = require('./mime');
const o = require('./output');
const w = require( './output').write;

const RETRY_MAX = 60;
let config;

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
    ({config, address, res, index = 0}) => {
      dirUtils
          .isReadyToView(config.fixedDirectory)
          .then( (ready) => {
            if (ready) {
              w(o.ready());
              sendRedirectFile(config.fixedDirectory, res);
            } else {
              if (index < RETRY_MAX) {
                setTimeout(() => {
                  ifTsFilesAreReadyThenSend(
                      {config, address, res,
                        index: index + 1});
                }, 1000);
                w(o.holding());
              } else {
                res.send('Error, timed out.');
              }
            }
          })
          .catch((err) => {
            console.log('Error: ', err);
            throw err;
          });
    };

module.exports.sendBackPlaylistWhenReady = ({config, address, res}) => {
  if (address) {
    config.segmenter.launchIfNecessary(config, {address}).then((_) => {
      ifTsFilesAreReadyThenSend({config, address, res});
    });
  }
};
