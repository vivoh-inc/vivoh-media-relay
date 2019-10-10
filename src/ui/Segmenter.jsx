'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const { Text, Box, Color } = require('ink');

const Segmenter = ({segmenters, config}) => {

  // console.log( Object.keys(segmenters).map( s => JSON.stringify(s)).join( '\n\n'));
  // process.exit(-1);

  const _segmenters = Object.keys( segmenters ).map( s => { segmenters[s].url = s; return segmenters[s]} );
  // console.log( _segmenters.map( s => JSON.stringify(s)).join( '\n\n'));
  // process.exit(-1);

  return (
    <Box  paddingBottom={1} paddingTop={1} flexDirection="column">
      <Text><Color blue>Segmenters</Color></Text>
      { _segmenters.map( s => {
        return (
          <Box key={s.url} flexDirection="column">
          <Text><Color red>{s.url}</Color>: {(s.status || 'off').trim().toUpperCase()}</Text>
          { on &&
            <Text> (<Color blue>http://localhost:{ config.port }/hls.html?s={s.url})</Color></Text>
            }
          </Box>
        )
      })};
    </Box>
  )
};

Segmenter.propTypes = {
  segmenter: PropTypes.object,
};

Segmenter.defaultProps = {
  segmenter: {},
};

module.exports = Segmenter;
