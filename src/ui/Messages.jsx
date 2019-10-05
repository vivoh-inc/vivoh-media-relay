const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');

const Messages = ({ messages }) => {
  if (!messages || !messages.length) {
    return null;
  } else {
    return messages.map(m => (
      <Text>
        <Color yellow>{m}</Color>
      </Text>
    ));
  }
};

Messages.propTypes = {
  messages: PropTypes.array,
};

Messages.defaultProps = {
  messages: [],
};

module.exports = Messages;
