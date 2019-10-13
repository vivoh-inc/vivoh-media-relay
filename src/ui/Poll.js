'use strict';

const React = require('react');
const {useState} = require('react');
const PropTypes = require('prop-types');
const {Text, Color, Box} = require('ink');
const useInterval = require('./UseInterval');

const Poll = ({poll}) => {
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
    return React.createElement(
        Box,
        {
          paddingTop: 1,
          height: 4,
          flexDirection: 'column',
        },
        React.createElement(
            Text,
            null,
            'Poll Server: ',
            React.createElement(
                Color,
                {
                  green: true,
                },
                poll.url
            )
        ),
        poll.error &&
        React.createElement(
            Text,
            null,
            React.createElement(
                Color,
                {
                  red: true,
                },
                'An error occurred contacting the poll server.'
            )
        ),
        poll.response &&
        React.createElement(
            Text,
            null,
            ' ',
            React.createElement(
                Color,
                {
                  blue: true,
                },
                'JSON: ',
                JSON.stringify(poll.response)
            )
        )
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
