const path = require('path');
const fs = require('fs');
const dirUtils = require('./dir_utils');
const mime = require('./mime');
const o = require('./output');
const w = require( './output').write;
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
    ({config, address, res, index = 0}) => {
      dirUtils
          .isReadyToView(config.fixedDirectory)
          .then( (ready) => {
            if (ready && serverStatus.on) {
              w(o.ready());
              sendRedirectFile(config.fixedDirectory, res);
            } else {
              if (serverStatus.on && index < RETRY_MAX) {
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
