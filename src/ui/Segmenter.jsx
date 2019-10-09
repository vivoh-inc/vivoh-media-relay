'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { Text, Box } = require('ink');

const Segmenter = ({segmenters}) => {
  return (
    <Box height={3}>
      { Object.keys( segmenters ).map( s => {
        return (
          <>
          <Text>Segmenter address: {s.url }</Text>
          <Text>Segmenter status: {s.status || 'off'}</Text>
          </>
          );
      })};
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
