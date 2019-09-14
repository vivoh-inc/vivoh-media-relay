const programs = {};

module.exports.getProgram = (pid) => {
  return programs[pid];
};

module.exports.addProgram = (pid, mcastUrl) => {
  programs[pid] = mcastUrl;
};

module.exports.removeProgram = (pid) => programs[pid] = undefined;
