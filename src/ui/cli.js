#!/usr/bin/env node
'use strict';
const React = require('react');
const {render} = require('ink');
const importJsx = require('import-jsx');
const ui = importJsx('./ui.jsx');

module.exports.app = (startFn) => render(React.createElement(ui, {startFn} ));
