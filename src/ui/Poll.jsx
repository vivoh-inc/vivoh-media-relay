'use strict';

const React = require('react');
const { useState } = require( 'react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');
const useInterval = require('./UseInterval');

const Poll = ({ poll }) => {

  const [nextPoll, setNextPoll] = useState(0);

  useInterval( () => {
    let calc = nextPoll - 1;
    if (nextPoll <= 0 ) {
      calc = poll.time;
    }
    setNextPoll( calc );
  }, 1000 );

  if (!poll) {
    return null;
  } else {
    return (
    <>
      <Text>
        Poll Server: <Color green>{poll.url}</Color> [Checking again in: { nextPoll } seconds]
        {poll.error && (
          <Color red>An error occurred with the poll server.</Color>
        )}
      </Text>
      <Text> { JSON.stringify(poll.response) } </Text>
    </>
    )
  }
};

Poll.propTypes = {
  poll: PropTypes.object,
};

Poll.defaultProps = {
  on: {},
};

module.exports = Poll;

