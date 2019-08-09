const {processConfig} = require('./config');
const {run} = require('./server');
const {timebomb} = require('./timebomb');
const processedArguments = require('minimist')(process.argv.slice(2));
const {banner} = require('./output');
const {usage} = require('./usage');
const {checkForFfmpeg} = require('./ffmpeg');

const config = processConfig(processedArguments);

checkForFfmpeg(config)
    .then((_) => {
      timebomb();
      banner();

      if (!config.valid) {
        usage();
      } else {
        run(config);
      }
    })
    .catch((error) => {
      console.log(`ffmpeg is not available (tried with binary at path '${error}'), please check your settings`);
    });
