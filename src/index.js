const {processConfig} = require('./config');
const {run} = require('./server');
const {timebomb} = require('./timebomb');
const processedArguments = require('minimist')(process.argv.slice(2));
const {banner} = require('./output');
const {usage} = require('./usage');

const config = processConfig(processedArguments);

timebomb();
banner();

if (!config.valid) {
  usage();
} else {
  run(config);
}
