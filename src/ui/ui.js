/* eslint-disable no-undef */
'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const { Text, Box } = require('ink');
const { useState, useEffect } = require('react');
const useInterval = require('./UseInterval');
const importJsx = require('import-jsx');
const Server = importJsx('./Server.js');
const Messages = importJsx('./Messages.js');
const Errors = importJsx('./Errors.js');
const Poll = importJsx('./Poll.js');
const Segmenter = importJsx('./Segmenter.js');
const Programs = importJsx('./Programs.js');
const merge = require('lodash/merge');
const fs = require('fs');

const App = ({ startFn }) => {
  const [banner, setBanner] = useState('');
  const [poll, _setPoll] = useState({});
  const [server, _setServer] = useState({});
  const [errors, _setErrors] = useState([]);
  const [programs, _addProgram] = useState([]);
  const [segmenters, _setSegmenter] = useState({});
  const [delay, setDelay] = useState(1 * 1000);
  const [tick, setTick] = useState(1);
  const [messages, setMessages] = useState([]);
  const [features, setFeatures] = useState( {poll: false});

  useEffect(() => {
    try {
      startFn({
        errors: addError,
        server: setServer,
        banner: setBanner,
        poll: setPoll,
        message: addMessage,
        programs: addProgram,
        updateSegmenter,
        stop: () => setDelay(0),
      });
    } catch( err) {
      writeError(err);
    }
  }, []);

  useInterval(() => {
    setTick(tick + 1);
  }, delay);

  const addError = error => {
    try {
    _setErrors(_errs => {
      if (_errs.length > 5) {
        _errs.shift();
      }
      return [error, ..._errs];
    });
  } catch (err) {
    writeError(err);
  }

  };

  const updateSegmenter = (name, details) => {
    try {
    _setSegmenter(original => {
      original[name] = details;
      _setSegmenter(original);
    });
  } catch (err) {
    writeError(err);
  }

  };

  const addProgram = program => {
    try {
    _addProgram(programs => [program, ...programs]);
  } catch (err) {
    writeError(err);
  }

  };

  // const setSegmenter = updated => {
  //   _setSegmenter(original => {
  //     const merged = merge(original, updated);
  //     return merged;
  //   });
  // };

  const addMessage = msg => {
    try {
    setMessages(_msgs => {
      if (_msgs.length >= 5) {
        _msgs.pop();
      }
      // Not sure why this is necessary, but otherwise we get each message twice.
      // if (_msgs[0] === msg) {
      // 	return _msgs;
      // }
      // else {
      return [{ message: msg, timestamp: new Date().getTime() }, ..._msgs];
      // }
    });
  } catch (err) {
    writeError(err);
  }
  };

  const setPoll = update => {
    setFeatures({ poll:true});
    try {
    _setPoll(original => {
      if (original.error && !update.error) {
        original.error = null;
      }
      if (update.error && original.json) {
        original.json = null;
      }
      const merged = merge(original, update);
      return merged;
    });
  } catch (err) {
    writeError(err);
  }

  };

  const writeError = (err) => {
    fs.appendFileSync('error.txt', `Error: ${err}`);
  }

  const setServer = update => {
    try {
    // addMessage(`Updated server at ${new Date()} ${original.on}`);
    _setServer(original => {
      const merged = merge(original, update);
      return merged;
    });
  } catch (err) {
    writeError(err);
  }

  };

  // There is a double rendering that happens unless we wait a few seconds.
  if (tick < 2) {
    return null;
  } else {
    return (
      <>
        <Box height={3}>
          <Text>{banner}</Text>
        </Box>

        <Server server={server} />

        { features.poll &&
          <>
          <Poll poll={poll} time={tick} />
          <Programs programs={programs} />
          </>
        }

        <Segmenter config={server.config} segmenters={segmenters} />

        <Messages messages={messages} />
        <Errors messages={errors} />

        <Text>Uptime: {tick} seconds</Text>
      </>
    );
  }
};

App.propTypes = {
  // startFn: PropTypes.function,
};

App.defaultProps = {
  // startFn: 'Stranger',
};

module.exports = App;
