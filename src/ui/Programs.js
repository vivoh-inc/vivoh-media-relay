const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');

const Programs = ({ programs }) => {
  if (!programs || !programs.length) {
    return null;
  } else {
    return programs.map((p) => {
      return p.redirect
        ? undefined
        : React.createElement(
            Text,
            {
              key: p.name,
            },
            React.createElement(
                Color,
                {
                  yellow: true,
                },
                p.name,
                ' [',
                p.id,
                '] '
            )
        );
    });
  }
};

Programs.propTypes = {
  programs: PropTypes.array,
};

Programs.defaultProps = {
  programs: undefined,
};

module.exports = Programs;
