const {processConfig} = require('./config');
const {run} = require('./server');
const {timebomb} = require('./timebomb');
const processedArguments = require('minimist')(process.argv.slice(2));
const o = require('./output');
const {usage} = require('./usage');

// Update path to add cwd
process.env.PATH = `${process.env.PATH}:.`;

const app = require('./ui/cli').app;

const config = processConfig(processedArguments);

const startFn = (renderer) => {
  o.setRenderer(renderer);
  config.segmenter
      .checkForBinary(config)
      .then((_) => {
        timebomb();
        o.banner();
        if (!config.valid) {
          usage();
        } else {
          run(config);
        }
      })
      .catch((_) => {
        console.log('An error occurred running the segmenter', _);
      });
};

app(startFn);
