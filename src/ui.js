'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');
const { useState, useEffect } = require('react');
const useInterval = require('./UseInterval');

const App = ({ name, startFn }) => {

	const [information, setInformation] = useState('');
	useEffect( () => {
		startFn(setInformation);
	}, [] );
	const [time, setTime] = useState(0);
	useInterval(() => setTime(time + 1), 1000);

	return (
		<>
			<Text>
				Time: <Color green>{time}</Color>
			</Text>
			<Text>
				Information: <Color green>{information}</Color>
			</Text>
			<Text>
				Hello, <Color green>{name}</Color>
			</Text>
		</>
	);
};

App.propTypes = {
	name: PropTypes.string,
};

App.defaultProps = {
	name: 'Stranger',
};

module.exports = App;
