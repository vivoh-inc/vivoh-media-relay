'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const { Text, Color } = require('ink');
const { useState, useEffect } = require('react');
const useInterval = require('./UseInterval');
const importJsx = require('import-jsx');
const Server = importJsx('./Server.jsx');
const Messages = importJsx('./Messages.jsx');
const Errors = importJsx('./Errors.jsx');
const Poll = importJsx('./Poll.jsx');
const Programs = importJsx('./Programs.jsx');
const merge = require('lodash/merge');

const App = ({ startFn }) => {
  const [banner, setBanner] = useState('');
  const [poll, _setPoll] = useState({});
  const [server, _setServer] = useState({});
	const [errors, _setErrors] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [delay, setDelay] = useState(1*1000);
	const [tick, setTick] = useState(1);
	const [messages, setMessages] = useState([]);

  const addError = error => {
		if (_errs.length > 5) {
			_errs.unshift();
		}
		_errs.push(error);
    _setErrors([..._errs]);
  };

	const addMessage = (msg) => {
		if (messages.length >= 10 ) {
			messages.unshift();
		}
		// console.log( "Length of messages: ", messages.length );
		setMessages([msg, ...messages]);
	}

  const setPoll = update => {
		const merged = merge(poll, update);
		addMessage(`Updated poll is ${JSON.stringify(merged)}`);
		_setPoll(merged);
	};

  const setServer = update => {
		const merged = merge(server, update);
		addMessage(`Updated server is ${JSON.stringify(merged)}`);
		_setServer(merged);
	};

  useEffect(() => {
    startFn({
      errors: addError,
      server: setServer,
      banner: setBanner,
			poll: setPoll,
			programs: setPrograms,
			stop: () => setDelay(0),
    });
  }, []);

	useInterval( () => {
		setTick( tick + 1 );
	}, delay );

  return (
    <>
      <Text>{banner}</Text>
		  <Server server={server}/>
		  <Poll poll={poll} time={tick}/>
			<Programs programs={programs}/>
			<Messages messages={messages}/>
			<Errors messages={errors}/>
			<Text>{ tick }</Text>
    </>
  );
};

App.propTypes = {
  // startFn: PropTypes.function,
};

App.defaultProps = {
  // startFn: 'Stranger',
};

module.exports = App;
