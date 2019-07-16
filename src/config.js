const fs = require('fs');
const path = require('path');
const config = {};
const ffmpegSegmenter = require('./ffmpeg');

module.exports.DEFAULT_FIXED_DIRECTORY = './vivoh_media_relay';
module.exports.DEFAULT_POLLING_TIME = 60;

module.exports.updateConfig = (key, value) => {
  config[key] = value;
  return config;
};

const getCredentials = (encrypted) => {
  const credentials = {};
  try {
    let keyPath = path.join(__dirname, '..', 'certs', 'privatekey.pem');
    let certificatePath = path.join(
        __dirname,
        '..',
        'certs',
        'certificate.pem'
    );
    credentials.key = fs.readFileSync(keyPath, 'utf8');
    credentials.cert = fs.readFileSync(certificatePath, 'utf8');
    if (typeof encrypted === 'string' && encrypted.indexOf(',') !== -1) {
      // Using custom paths
      const [a, b, c] = encrypted.split(',');
      keyPath = a;
      certificatePath = b;
      const chain = c;
      console.log('Using custom cert paths: ', keyPath, certificatePath, chain);
      credentials.key = fs.readFileSync(keyPath, 'utf8');
      credentials.cert = fs.readFileSync(certificatePath, 'utf8');
      credentials.ca = fs.readFileSync(chain, 'utf8');
    }
  } catch (e) {
    console.error('Unable to retrieve certificates', e.message);
  }
  return credentials;
};

const getExtras = (args) => {
  const e = {
    extras: args.ffmpegExtras,
    bin: args.ffmpegBin,
    log: args.ffmpegLogFile,
  };
  return e;
};

module.exports.processConfig = (processedArguments) => {
  config.fixedDirectory = processedArguments.d;
  config.extras = getExtras(processedArguments);
  config.ipAddress = processedArguments.i || '0.0.0.0';
  config.port = processedArguments.p || 8888;
  // fix it up.
  config.port = parseInt(config.port);
  config.valid = true;
  config.type = 'hls';

  config.extras = getExtras(processedArguments);

  if (!config.fixedDirectory) {
    config.fixedDirectory = this.DEFAULT_FIXED_DIRECTORY;
    // Make it if not there.
    if (!fs.existsSync(config.fixedDirectory)) {
      fs.mkdirSync(config.fixedDirectory);
    } else {
      fs.readdirSync(config.fixedDirectory).forEach((f) => {
        const fileToDelete = path.join(config.fixedDirectory, f);
        console.log('about to delete: ', fileToDelete);
        fs.unlinkSync(fileToDelete);
      });
    }
  } else {
    // Fix it up.
    config.fixedDirectory = path.resolve(config.fixedDirectory);
  }

  config.credentials = processedArguments.e
    ? getCredentials(processedArguments.e)
    : undefined;
  config.segmenter = ffmpegSegmenter;
  config.overwrite = processedArguments.o;
  config.logFormat = processedArguments.l || processedArguments.logFormat;

  // Polling
  // -t polling time in seconds to check to see if a live event has started
  //   eg "600"
  // -u url to polling info site that will return "on" or "off"
  //   eg "http://foo.com/status.txt"
  if (processedArguments.u) {
    config.poll = {url: processedArguments.u};
    if (config.poll.url) {
      config.poll.time =
      (processedArguments.t || module.exports.DEFAULT_POLLING_TIME);
    }
  }

  return config;
};
