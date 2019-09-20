const fs = require('fs');
const path = require('path');
const config = {};
const ffmpegSegmenter = require('./ffmpeg');
const tsduckSegmenter = require('./tsduck');

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

const getExtras = (args, name) => {
  const e = name === 'tsduck' ? {
    extras: args.tsduckExtras,
    bin: args.tsduckBin,
    log: args.tsduckLogFile,
  } :
  {
    extras: args.ffmpegExtras,
    bin: args.ffmpegBin,
    log: args.ffmpegLogFile,
  };
  return e;
};

module.exports.processConfig = (processedArguments) => {
  if (!processedArguments) {
    throw new Error('No arguments were provided to configuration, error!');
  }

  config.fixedDirectory = processedArguments.d;
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

  config.segmenterName = processedArguments.s !== 'tsduck' ? 'ffmpeg' : 'tsduck';
  config.segmenter = config.segmenterName === 'ffmpeg' ? ffmpegSegmenter : tsduckSegmenter;
  config.extras = getExtras(processedArguments, config.segmenterName);
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
    if (processedArguments.systemInformation) {
      config.poll.systemInformation = true;
    }
  }

  return config;
};
