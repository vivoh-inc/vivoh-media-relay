/* eslint-disable max-len */
const colors = require('colors'); // eslint-disable-line no-unused-vars

// This let's tests pass.
let _renderer = {
    banner: () => {},
    message: () => {},
    errors: () => {},
    poll: () => {},
    server: () => {},
    updateSegmenter: () => {},
};

module.exports.setRenderer = (renderer) => _renderer = renderer;
const { version } = require('./version');

module.exports.message = (msg) => {
    _renderer.message(msg);
};

module.exports.errors = (err) => {
    _renderer.errors(err);
};

module.exports.poll = (poll) => {
    _renderer.poll(poll);
};

module.exports.banner = () => {
    _renderer.banner(`{bold}Vivoh Media Relay{/bold} {underline}${version}{/underline}`);
};

module.exports.server = (server) => {
    // console.log('Server:', server);
    _renderer.server(server);
};

// module.exports.segmenter = (_segmenter) => _renderer.segmenter(_segmenter);
module.exports.updateSegmenter = (name, details) => _renderer.updateSegmenter(name, details);