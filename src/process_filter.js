module.exports.pidIsRunning = (processes, pid) => {
  if ( processes ) {
    return processes.find( (p) => parseInt(p.pid) === parseInt(pid));
  } else {
    return false;
  }
};
