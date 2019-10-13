'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const {Text, Color, Box} = require('ink');

const Server = (props) => {
  const {server} = props;
  if (!server) {
    return null;
  } else {
    const {on, config} = server;
    return React.createElement(
        Box,
        {
          height: 3,
          flexDirection: 'column',
        },
        React.createElement(
            Text,
            null,
            'Server status: ',
        on
          ? React.createElement(
              Color,
              {
                green: true,
              },
              'listening on ',
              config.port
          )
          : React.createElement(
              Color,
              {
                red: true,
              },
              'off'
          )
        )
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
