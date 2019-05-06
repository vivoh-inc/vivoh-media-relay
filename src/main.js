
module.exports.start = (config, {hlsRun, run, failure}) => {
  const args = {config, failure, run};
  if ('hls' === config.type) {
    hlsRun(args);
  } else {
    failure( 'Invalid mode: ' + config.type );
  }
};
