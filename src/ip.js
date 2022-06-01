
const ip = require('ip');

module.exports.getIpAddress = (argv) => (argv.i || ip.address());
