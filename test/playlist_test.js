const expect = require('expect');
const sinon = require('sinon');
const fs = require('fs');
const {rewriteM3u8File} = require('../src/playlist');

const m3u8File = fs.readFileSync('./test/fixtures/index.m3u8').toString();

describe('#playlist', () => {
  describe('#rewriteM3u8File', () => {
    it('should rewrite with the correct paths', () => {
      const rewritten = rewriteM3u8File(m3u8File, '123456');
      expect(rewritten).toEqual(
          `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:2
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:2.000000,
123456/redirect0.ts
#EXTINF:2.000000,
123456/redirect1.ts
#EXTINF:2.000000,
123456/redirect2.ts
#EXTINF:2.000000,
123456/redirect3.ts
`
      );
    });
  });
});
