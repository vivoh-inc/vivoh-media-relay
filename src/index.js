const {processConfig} = require('./config');
const {run} = require('./server');
const {timebomb} = require('./timebomb');
const processedArguments = require('minimist')(process.argv.slice(2));
const o = require('./output');
const {usage} = require('./usage');

// Update path to add cwd
process.env.PATH = `${process.env.PATH}:.`;

const app = require('./ui/cli').app;

const startFn = (renderer) => {
  o.setRenderer(renderer);
  const config = processConfig(processedArguments);
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
        o.errors('An error occurred running the segmenter' + _);
      });
};

app(startFn);
