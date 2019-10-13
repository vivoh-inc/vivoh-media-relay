const programs = {};

module.exports.getProgram = (pid) => {
  return programs[pid];
};

module.exports.addProgram = (pid, program) => {
  programs[pid] = program;
};

module.exports.removeProgram = (pid) => programs[pid] = undefined;

module.exports.clearPrograms = () => programs = {};
