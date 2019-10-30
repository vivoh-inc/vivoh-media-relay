const o = require('./output');

// timebomb it
const isExpired = () => {
  const now = new Date();
  return (now.getYear() > 119 && now.getMonth() >= 1) || (now.getYear() > 120);
};

module.exports.timebomb = function() {
  if ( isExpired() ) {
    o.message('This server binary has expired. Please check https://vivoh.com/products/vmr for an update');
    process.exit( -1 );
  }
};
