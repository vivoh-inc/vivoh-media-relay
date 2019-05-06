const fs = require("fs");
const path = require("path");
const config = {};
const vlcSegmenter = require("./vlc");
const ffmpegSegmenter = require("./ffmpeg");

module.exports.updateConfig = (key, value) => {
  config[key] = value;
  return config;
};

const getExtras = args => {
  if (args.v) {
    const e = {
      extras: args.vlcExtras,
      vlc: args.vlcBin,
      log: args.vlcLogFile
    };
    return e;
  } else {
    const e = {
      extras: args.ffmpegExtras,
      ffmpeg: args.ffmpegBin,
      log: args.ffmpegLogFile
    };
    return e;
  }
};

module.exports.processConfig = processedArguments => {
  config.fixedDirectory = processedArguments.d;
  config.useFfmpeg = config.useVlc = false;
  if( processedArguments.f ) {
    config.useFfmpeg = true;
  }
  else {
    config.useVlc = true;
  }
  config.extras = getExtras(processedArguments);
  config.ipAddress = processedArguments.i || '0.0.0.0';
  config.port = processedArguments.p || 8888;

  config.segmenter = undefined;

  if (processedArguments.ffmpegDontAddAacSwitches) {
    config.dontAddAacSwitches = true;
  }
  config.valid = true;
  config.type = "hls";

  // config.useFfmpeg;
  config.extras = getExtras(processedArguments);

  if (!config.fixedDirectory) {
    config.fixedDirectory = "./vivoh_media_relay";
    // Make it if not there.
    if (!fs.existsSync(config.fixedDirectory)) {
      fs.mkdirSync(config.fixedDirectory);
    } else {
      fs.readdirSync(config.fixedDirectory).forEach(f => {
        const fileToDelete = path.join(config.fixedDirectory, f);
        console.log("about to delete: ", fileToDelete);
        fs.unlinkSync(fileToDelete);
      });
    }
  } else {
    // Fix it up.
    config.fixedDirectory = path.resolve(config.fixedDirectory);
  }

  config.segmenter = !config.useFfmpeg ? ffmpegSegmenter : vlcSegmenter;
  config.overwrite = processedArguments.o;
  config.logFormat = processedArguments.l || processedArguments.logFormat;

  return config;
};
