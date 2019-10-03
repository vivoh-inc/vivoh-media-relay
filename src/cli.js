#!/usr/bin/env node
'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const {render} = require('ink');
const ui = importJsx('./ui');

module.exports.app = (startFn) => render(React.createElement(ui, {startFn} ));
