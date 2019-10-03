const { processConfig } = require('./config');
const { run } = require('./server');
const { timebomb } = require('./timebomb');
const processedArguments = require('minimist')(process.argv.slice(2));
const { banner } = require('./output');
const { usage } = require('./usage');

// Update path to add cwd
process.env.PATH = `${process.env.PATH}:.`;

const app = require('./cli').app;

const config = processConfig(processedArguments);

const startFn = ( update ) => {
  config.segmenter
      .checkForBinary(config)
      .then((_) => {
        timebomb();
        banner();
        if (!config.valid) {
          usage();
        } else {
          update('Hi there');
          run(config);
        }
      })
      .catch((_) => {
        console.log('An error occurred running the segmenter');
      });
};

app(startFn);
