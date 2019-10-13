const React = require('react');
const PropTypes = require('prop-types');
const {Text, Color} = require('ink');

const Messages = ({messages}) => {
  if (!messages || !messages.length) {
    return null;
  } else {
    return messages.map((m) =>
      React.createElement(
          Text,
          {
            key: m.timestamp,
          },
          React.createElement(
              Color,
              {
                yellow: true,
              },
              new Date(m.timestamp).toString(),
              ': ',
              ( m.message + ( m.count > 0 ? ` (${m.count})` : '' ) )
          )
      )
    );
  }
};

Messages.propTypes = {
  messages: PropTypes.array,
};

Messages.defaultProps = {
  messages: [],
};

module.exports = Messages;
