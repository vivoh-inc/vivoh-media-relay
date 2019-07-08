const fs = require('fs');
const path = require('path');
const config = {};
const ffmpegSegmenter = require('./ffmpeg');

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
    ffmpeg: args.ffmpegBin,
    log: args.ffmpegLogFile,
  };
  return e;
};

module.exports.processConfig = (processedArguments) => {
  config.fixedDirectory = processedArguments.d;
  config.useFfmpeg = true;
  config.extras = getExtras(processedArguments);
  config.ipAddress = processedArguments.i || '0.0.0.0';
  config.port = processedArguments.p || 8888;

  config.segmenter = undefined;

  if (processedArguments.ffmpegDontAddAacSwitches) {
    config.dontAddAacSwitches = true;
  }
  config.valid = true;
  config.type = 'hls';

  // config.useFfmpeg;
  config.extras = getExtras(processedArguments);

  if (!config.fixedDirectory) {
    config.fixedDirectory = './vivoh_media_relay';
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

  config.credentials = processedArguments.e ? getCredentials(processedArguments.e) : undefined;

  config.segmenter = ffmpegSegmenter;
  config.overwrite = processedArguments.o;
  config.logFormat = processedArguments.l || processedArguments.logFormat;

  return config;
};
