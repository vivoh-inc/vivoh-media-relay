'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color, Box } = require('ink');

const Segmenter = ({segmenter}) => {
  const { status } = segmenter;

  return (
    <Box height={3}>
      <Text>Segmenter status: {status || 'off'}</Text>
    </Box>
    );
};

Segmenter.propTypes = {
  segmenter: PropTypes.object,
};

Segmenter.defaultProps = {
  segmenter: {},
};

module.exports = Segmenter;
