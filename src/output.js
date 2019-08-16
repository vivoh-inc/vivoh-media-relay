/* eslint-disable max-len */
const colors = require('colors'); // eslint-disable-line no-unused-vars
const ready = module.exports.ready = () => '.'.green.bold;
const startFfmpeg = module.exports.startFfmpeg = () => '*'.red.bold;
const startTSDuck = module.exports.startTSDuck = () => '*'.red.bold;
const startServer = module.exports.startServer = () => '🛫'.red.bold;
const stopServer = module.exports.stopServer = () => '🛬'.blue.bold;
const holding = module.exports.holding = () => '@'.yellow.bold;
const pollServerFailure = module.exports.pollServerFailure = () => '↯'.red.bold;
const pollServerOn = module.exports.pollServerOn = () => '📻'.green.bold;
const pollServerOff = module.exports.pollServerOff = () => '🚫'.red.bold;
const {version} = require( './version');

module.exports.write = (t) => {
  process.stdout.write(t);
};

module.exports.banner = () => console.log(`\n\n${'Vivoh Media Relay'.rainbow} ${version.red}`);

module.exports.legend = () => {
  let rv = `
${'LEGEND'.dim}\n`;

  // rv += `${startFfmpeg()}: ${'Starting ffmpeg process'.dim}\n`;
  rv += `${startTSDuck()}: ${'Starting tsduck process'.dim}\n`;
  rv += `${startServer()}: ${'started listening for playlist requests (HTTP server on)'.dim}\n`;

  rv += `${ready()}: ${'TS files and m3u8 file ready, broadcast started'.dim}
${holding()}: ${'holding for the TS files to be ready'.dim}
  `;

  rv += `${stopServer()}: ${'Stopped listening for playlist requests (HTTP server off)'.dim}\n`;
  rv += `${pollServerOff()}: ${'The poll server indicates broadcasting is off'.dim}\n`;
  rv += `${pollServerOn()}: ${'The poll server indicates broadcasting is on'.dim}\n`;
  rv += `${pollServerFailure()}: ${'An error occurred when contacting the server'.dim}\n`;

  return rv;
};

module.exports.pollServerFailure = () => '↯'.red.bold;
module.exports.pollServerOn = () => '📻'.green.bold;
module.exports.pollServerOff = () => '🚫'.red.bold;
