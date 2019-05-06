const getAddress = require('../src/address').getAddress;
const getAppAndStreamFromAddress = require('../src/address').getAppAndStreamFromAddress;
const expect = require('expect');

const rtpMcastAddress = 'rtp://239.0.0.1:1234';
const udpMcastAddress = 'udp://239.0.0.1:1234';
const withPktSize = 'udp://239.0.0.1:1234?pkt_size=1316';

describe( 'address', () => {
  describe( 'gets the correct address', () => {
    it( 'should not crash', () => {
      const address = getAddress();
      expect(address).toEqual(undefined);
    });

    it( 'should give back nothing when no args provided', () => {
      const req = {query: {s: rtpMcastAddress}};
      const address = getAddress(req);
      expect(address).toEqual(rtpMcastAddress);
    });
  });

  describe( 'get the app and stream from an address', () => {
    it( 'should not crash', () => {
      expect(getAppAndStreamFromAddress()).toBe(undefined);
    });

    it( 'should get the app and strean', () => {
      const {app, stream} = getAppAndStreamFromAddress(rtpMcastAddress);
      expect(app).toBe('rtp');
      expect(stream).toBe('239_0_0_1__1234');
    });

    it( 'should get the right protocol', () => {
      const {app} = getAppAndStreamFromAddress(udpMcastAddress);
      expect(app).toBe('udp');
    });

    it( 'should get the app and stream even with pkt_size address', () => {
      const {app, stream} = getAppAndStreamFromAddress(withPktSize);
      expect(app).toBe('udp');
      expect(stream).toBe('239_0_0_1__1234');
    });
  });
});
