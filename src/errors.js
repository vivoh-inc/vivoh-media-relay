const {usage} = require('./usage');
const o = require('output');

module.exports.failure = (msg) => {
  // console.log(msg);
  o.errors(msg);
  usage();
  exit(1);
};

const exit = module.exports.exit = (code, message) => {
  if (message) {
    o.errors(message);
    // console.log(message);
  }
  usage();
  process.exit(code);
};
