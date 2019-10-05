'use strict';

const React = require('react');
const { useState } = require('react');
const PropTypes = require('prop-types');
const { Text, Color, Box } = require('ink');
const useInterval = require('./UseInterval');

const Poll = ({ poll }) => {
  const [nextPoll, setNextPoll] = useState(0);

  useInterval(() => {
    let calc = nextPoll - 1;
    if (nextPoll <= 0) {
      calc = poll.time;
    }
    setNextPoll(calc);
  }, 1000);

  if (!poll) {
    return null;
  } else {
    return (
      <Box paddingTop={1} height={4} flexDirection="column">
        <Text>
          Poll Server: <Color green>{poll.url}</Color>
          {/* [Checking again in: { nextPoll } seconds] */}
        </Text>
        {poll.error && (
          <Text>
            <Color red>An error occurred contacting the poll server.</Color>
          </Text>
        )}
        {poll.response && (
          <Text>
            {' '}
            <Color blue>JSON: {JSON.stringify(poll.response)}</Color>
          </Text>
        )}
      </Box>
    );
  }
};

Poll.propTypes = {
  poll: PropTypes.object,
};

Poll.defaultProps = {
  on: {},
};

module.exports = Poll;
