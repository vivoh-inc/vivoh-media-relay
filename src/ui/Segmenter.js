'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const {Text, Box, Color} = require('ink');

const Segmenter = ({segmenters, config}) => {
  const _segmenters = Object.keys(segmenters).map((s) => {
    segmenters[s].url = s;
    return segmenters[s];
  });

  return React.createElement(
      Box,
      {
        paddingBottom: 1,
        paddingTop: 1,
        flexDirection: 'column',
      },
      React.createElement(
          Text,
          null,
          React.createElement(
              Color,
              {
                blue: true,
              },
              'Segmenters'
          )
      ),
      _segmenters.map((s) => {
        return React.createElement(
            Box,
            {
              key: s.url,
              flexDirection: 'column',
            },
            React.createElement(
                Text,
                null,
                React.createElement(
                    Color,
                    {
                      red: true,
                    },
                    s.url
                ),
                ': ',
                (s.status || 'off').trim().toUpperCase()
            ),
            s.on &&
          React.createElement(
              Text,
              null,
              ' (',
              React.createElement(
                  Color,
                  {
                    blue: true,
                  },
                  'http://localhost:',
                  config.port,
                  '/hls.html?s=',
                  s.url,
                  ')'
              )
          )
        );
      })
  );
};

Segmenter.propTypes = {
  segmenter: PropTypes.object,
};

Segmenter.defaultProps = {
  segmenter: {},
};

module.exports = Segmenter;
