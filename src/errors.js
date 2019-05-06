const {usage} = require('./usage');

module.exports.failure = (msg) => {
  console.log(msg);
  usage();
  exit(1);
};

const exit = module.exports.exit = (code, message) => {
  if (message) {
    console.log(message);
  }
  usage();
  process.exit(code);
};
