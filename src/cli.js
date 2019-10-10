#!/usr/bin/env node
'use strict';
const React = require('react');
const {render} = require('ink');
const importJsx = require('import-jsx');
const path = require('path');
const ui = importJsx( path.join(process.cwd(), 'src/ui/ui.js'));

module.exports.app = (startFn) => render(React.createElement(ui, {startFn} ));
