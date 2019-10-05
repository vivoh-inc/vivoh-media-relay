'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');

const Server = ({ on }) => {
  return (
    <Text>Status: {on ? <Color green>on</Color> : <Color red>off</Color>}</Text>
  );
};

Server.propTypes = {
  on: PropTypes.bool,
};

Server.defaultProps = {
  on: false,
};

module.exports = Server;
