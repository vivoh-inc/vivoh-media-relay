const {convertPathToAddress} = require('../src/address');
const expect = require('expect');

describe('#address', () => {
  describe('#convertPathToAddress', () => {
    it('get back the correct address for rtp', () => {
      const address = convertPathToAddress("rtp__239_0_0_1__1234");
      expect(address).toBe('rtp://239.0.0.1:1234');
    });

    it('get back the correct address for udp', () => {
      const address = convertPathToAddress("udp__239_0_0_1__1234");
      expect(address).toBe('udp://239.0.0.1:1234');
    });
  });
});