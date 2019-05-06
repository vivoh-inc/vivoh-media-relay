const {checkForDirectory} = require('./dir_utils');

module.exports.hlsRun = ({config, failure, run}) => {
  checkForDirectory(config.fixedDirectory, failure, config.overwrite)
      .then((directoryIsReady) => {
        if (directoryIsReady) {
          run(config);
        } else {
          failure('The directory was invalid');
        }
      });
};
