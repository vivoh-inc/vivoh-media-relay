const {convertPathToAddress, getAddress} = require('../src/address');
const expect = require('expect');

describe('#address', () => {
  describe('#convertPathToAddress', () => {
    it('get back the correct address for rtp', () => {
      const address = convertPathToAddress('rtp__239_0_0_1__1234');
      expect(address).toBe('rtp://239.0.0.1:1234');
    });

    it('get back the correct address for udp', () => {
      const address = convertPathToAddress('udp__239_0_0_1__1234');
      expect(address).toBe('udp://239.0.0.1:1234');
    });
  });

  describe('#getAddress', () => {
    it( 'should get the address with something simple', () => {
      const url = '/index.m3u8?s=rtp://240.0.1.1:4567';
      expect(getAddress(url)).toBe('rtp://240.0.1.1:4567');
    });

    it( 'should get the address with everything', () => {
      const url = '/index.m3u8?s=rtp://240.0.1.1:4567?fifo_size=49152&overrun_nonfatal=1';
      expect(getAddress(url)).toBe('rtp://240.0.1.1:4567?fifo_size=49152&overrun_nonfatal=1');
    });
  });
});
