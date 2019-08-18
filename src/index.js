const {processConfig} = require('./config');
const {run} = require('./server');
const {timebomb} = require('./timebomb');
const processedArguments = require('minimist')(process.argv.slice(2));
const {banner} = require('./output');
const {usage} = require('./usage');

// Update path to add cwd
process.env.PATH = `${process.env.PATH}:.`;

const config = processConfig(processedArguments);

config.segmenter.checkForBinary(config)
    .then((_) => {
      timebomb();
      banner();
      if (!config.valid) {
        usage();
      } else {
        run(config);
      }
    })
    .catch( (_) => {
      console.log('An error occurred runinng the segmenter');
    });
