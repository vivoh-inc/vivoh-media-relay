const resolve = require('path').resolve;
const fs = require('fs');
const glob = require('glob');
const res = require('path').resolve;
const path = require('path');
const colors = require('colors'); // eslint-disable-line no-unused-vars
const w = require('./output').write;

module.exports.fixDirectory = (dir) => {
  let result = dir;
  if (dir[dir.length-1] !== '/') {
    result += '/';
  }
  // Make it absolute if needed
  return resolve(result);
};

const isReadyToView = module.exports.isReadyToView = (dir) => {
  return new Promise( (resolve, reject) => {
    try {
      const files = glob.sync(path.join(dir, '*.ts'));
      resolve(files.length >= 3);
    } catch ( err ) {
      reject(err);
    }
  });
};

module.exports.checkForDirectory = (dir, failure, overwrite=false) => {
  return new Promise( (resolve, reject) => {
    if (typeof dir === 'Array') {
      error( 'Error: your switches may be in error. ' +
      'Make sure to use --ffmpegExtras=\'...\' ' +
      'and not -ffmpegExtras \'...\')' );
    }

    if (!dir) {
      failure( 'You did not specify a directory');
      resolve(false);
    }

    try {
      fs.statSync(res(dir));
    } catch (e) {
      failure( `Error: Directory does not exist: ${dir}` );
      resolve(false);
      return;
    }

    // Check to see if there are already TS files there, unless
    // we have overwrite switch.
    if (!overwrite) {
      isReadyToView(dir)
          .then( (isAlreadyFull) => {
            if (isAlreadyFull) {
              failure( `ERROR: The directory "${dir}" is not empty. ` +
              'Either remove .ts files, or run with the -o switch' );
            }
            resolve(!isAlreadyFull);
          });
    } else {
      resolve(true);
    }
  });
};
