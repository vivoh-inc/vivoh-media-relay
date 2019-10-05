'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color, Box } = require('ink');

const Server = (props) => {
  const { server} = props;
  if (!server) {
    return null;
  } else {
    const { on, config } = server;
    return (
      <Box height={3} flexDirection="column">
      <Text>Server status: {on ? <Color green>listening on { config.port }</Color> : <Color red>off</Color>}</Text>
      { on && 
      <Text>HLS: <Color blue>http://localhost:{ config.port }/hls.html?s={config.url}</Color></Text>
      }
      </Box>
    );
  }
};

Server.propTypes = {
  on: PropTypes.bool,
};

Server.defaultProps = {
  on: false,
};

module.exports = Server;
