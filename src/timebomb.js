// timebomb it
const isExpired = () => {
  const now = new Date();
  return (now.getYear() > 118 && now.getMonth() >= 10) || (now.getYear() > 119);
};

module.exports.timebomb = function() {
  if ( isExpired() ) {
    console.log( 'This server binary has expired. Please check https://vivoh.com/products/vmr for an update' );
    process.exit( -1 );
  }
};
