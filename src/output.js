/* eslint-disable max-len */
const colors = require('colors'); // eslint-disable-line no-unused-vars
const ready = module.exports.ready = () => '.'.green.bold;
const startFfmpeg = module.exports.startFfmpeg = () => '*'.red.bold;
const startServer = module.exports.startServer = () => '🛫'.red.bold;
const holding = module.exports.holding = () => '@'.yellow.bold;
const {version} = require( './version');

module.exports.write = (t) => {
  process.stdout.write(t);
};

module.exports.banner = () => console.log(`\n\n${'Vivoh Media Relay'.rainbow} ${version.red}`);

module.exports.legend = () => {
  let rv = `
${'LEGEND'.dim}\n`;

  rv += `${startFfmpeg()}: ${'Starting ffmpeg process'.dim}\n`;
  rv += `${startServer()}: ${'started listening for playlist requests (HTTP server on)'.dim}\n`;

  rv += `${ready()}: ${'TS files and m3u8 file ready, broadcast started'.dim}
${holding()}: ${'holding for the TS files to be ready'.dim}
  `;

  return rv;
};

module.exports.pollServerFailure = () => '↯'.red.bold;
module.exports.pollServerOn = () => '📻'.green.bold;
module.exports.pollServerOff = () => '🚫'.red.bold;
