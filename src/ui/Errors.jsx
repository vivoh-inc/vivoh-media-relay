
const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');

const Errors = ( { errors }) => {
  if (!errors || !errors.length) {
    return null;
  } else {
      return (<>
      <Text><Color red>Errors:</Color></Text>
      { errors.map(e => <Text><Color grey>{e}</Color></Text>) }
      </>);
  }
};

Errors.propTypes = {
  errors: PropTypes.array,
};

Errors.defaultProps = {
  errors: [],
};

module.exports = Errors;
