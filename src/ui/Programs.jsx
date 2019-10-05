const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');

const Programs = ({ programs }) => {
  if (!programs || !programs.length) {
    return null;
  } else {
    return programs.map(p => (
      <Text key={p.name}>
        <Color yellow>{p.name} [{ p.id }] </Color>
      </Text>
    ));
  }
};

Programs.propTypes = {
programs: PropTypes.array,
};

Programs.defaultProps = {
  programs: undefined,
};

module.exports = Programs;
