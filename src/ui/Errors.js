const React = require('react');
const PropTypes = require('prop-types');
const {Text, Color} = require('ink');

const Errors = ({errors}) => {
  if (!errors || !errors.length) {
    return null;
  } else {
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            Text,
            null,
            React.createElement(
                Color,
                {
                  red: true,
                },
                'Errors:'
            )
        ),
        errors.map((e) =>
          React.createElement(
              Text,
              null,
              React.createElement(
                  Color,
                  {
                    grey: true,
                  },
                  e
              )
          )
        )
    );
  }
};

Errors.propTypes = {
  errors: PropTypes.array,
};

Errors.defaultProps = {
  errors: [],
};

module.exports = Errors;
