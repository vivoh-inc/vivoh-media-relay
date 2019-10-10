const path = require('path');
const fs = require('fs');
const dirUtils = require('./dir_utils');
const mime = require('./mime');
const o = require('./output');
const {serverStatus} = require('./server_status');
const RETRY_MAX = 60;

module.exports.setConfig = (cfg) => config = cfg;

const rewriteM3u8File = module.exports.rewriteM3u8File = (contents, programId) => {
  const lines = contents.split('\n');
  const rewritten = [];
  lines.forEach( (l) => {
    if (l.endsWith('.ts')) {
      rewritten.push( `${programId}/${l}`);
    } else {
      rewritten.push(l);
    }
  });
  return rewritten.join('\n');
};

const sendRedirectFile =
  module.exports.sendRedirectFile = (fixedDirectory, res, programId) => {
    const redirect = path.join(fixedDirectory, 'redirect.m3u8');
    const contents = fs.readFileSync(redirect).toString();
    const rewitten = rewriteM3u8File(contents, programId);
    res.set('Content-Type', mime.M3U8_MIME);
    res.send(rewritten);
  };


const ifTsFilesAreReadyThenSend =
  module.exports.ifTsFilesAreReadyThenSend =
    ({config, url, res, index = 0}) => {
      // TODO: need to check for the PID inside the fixed Directory
      // Better yet, add the correct directory+pid to the program?
      const program = config.programs.find((p) => p.url === url);
      const programDir = `${config.fixedDirectory}/${program.programId}`;
      if (program) {
        dirUtils
            .isReadyToView(programDir)
            .then( (ready) => {
              if (ready && serverStatus.on) {
                o.updateSegmenter(url, {status: 'ready'});
                sendRedirectFile(programDir, res);
              } else {
                if (serverStatus.on && index < RETRY_MAX) {
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
      } else {
        o.errors('FATAL Error: No program found');
        throw new Error('FATAL ERROR: No program found');
      }
    };

module.exports.sendBackPlaylistWhenReady = ({config, url, res}) => {
  if (url) {
    config.segmenter.launchIfNecessary(config, {url}).then((_) => {
      ifTsFilesAreReadyThenSend({config, url, res});
    });
  }
};
