const {getArgumentsForTSDuck} = require('../src/tsduck');
const expect = require('expect');

const address = 'rtp://239.0.0.1:1234';

describe('#tsduk', () => {
  describe('#getArgumentsForTsDuck', () => {
    // tsp -I ip 239.0.0.1:1234 -O hls vivoh_media_relay/redirect-.ts -p vivoh_media_relay/redirect.m3u8 -d 10
    it.skip('should get the correct format back', () => {
      expect(getArgumentsForTSDuck({address})).toBe(
          'tsp -I ip 239.0.0.1:1234 -O hls vivoh_media_relay/redirect-.ts -p vivoh_media_relay/redirect.m3u8 -d 10'
      );
    });
  });
});
