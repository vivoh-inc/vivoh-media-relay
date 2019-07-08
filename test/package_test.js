const package = require('../package');
const expect = require('expect');

describe( '#package.json', () => {
  it( 'should have the correct assets', () => {
    expect(package.pkg.assets).toEqual(
	    [
          'assets',
          'node_modules/vivoh-media-players/assets',
          'certs',
	    ]);
  });
});
