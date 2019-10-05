/* eslint-disable max-len */
const colors = require('colors'); // eslint-disable-line no-unused-vars

// Setup default no-ops.
let _renderer = {poll: () => {}, server: () => {}};
module.exports.setRenderer = (renderer) => _renderer = renderer;

const ready = module.exports.ready = () => '.'.green.bold;
const startFfmpeg = module.exports.startFfmpeg = () => '*'.red.bold;
const startTSDuck = module.exports.startTSDuck = () => '*'.red.bold;
const startServer = module.exports.startServer = () => '🛫'.red.bold;
const stopServer = module.exports.stopServer = () => '🛬'.blue.bold;
const holding = module.exports.holding = () => '@'.yellow.bold;
const pollServerFailure = module.exports.pollServerFailure = () => _renderer.poll({error: true});
const pollServerOn = module.exports.pollServerOn = () => {
  // '📻'.green.bold;
  _renderer.poll( {on: false});
};
const pollServerOff = module.exports.pollServerOff = () => _renderer.poll({on: false});//  '🚫'.red.bold;
const {version} = require( './version');

module.exports.write = (t) => {
  // process.stdout.write(t);
};

module.exports.errors = (err) => {
  _renderer && _renderer.errors(err);
};

module.exports.poll = (poll) => {
  // console.log( "Got poll information: ", poll, _renderer.poll );
  _renderer.poll(poll);
};

module.exports.banner = () => {
  _renderer.banner(`\n\n${'Vivoh Media Relay'.rainbow} ${version.red}`);
};

module.exports.server = (server) => _renderer.server(server);

module.exports.legend = () => {
  let rv = `
${'LEGEND'.dim}\n`;

  rv += `${startFfmpeg()}: ${'Starting ffmpeg process'.dim}\n`;
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
