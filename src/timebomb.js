const o = require('./output');

module.exports.timebomb = function() {
  if ( isExpired() ) {
    o.message('This server binary has expired. Please check https://vivoh.com/products/vmr for an update');
    process.exit( -1 );
  }
};


// timebomb it
const isExpired = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getYear();
  // console.log('M/Y', month, year);
  return !(
    (month === 11 || month === 0 || month === 1 || month === 2) &&
    year < 121
  );
};
