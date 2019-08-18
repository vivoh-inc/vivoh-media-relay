const ffmpeg = require('../src/ffmpeg');
const expect = require('expect');

const address = 'rtp://239.0.0.1:1234';

describe('#ffmpeg', () => {
  describe('gets the correct arguments', () => {
    it('should give back nothing when no args / empty object provided', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg();
      expect(exeAndArgs).toEqual({});
      const exeAndArgs2 = ffmpeg.getArgumentsForFfmpeg({});
      expect(exeAndArgs2).toEqual({});
    });

    it('should work with just the address', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({address});
      expect(exeAndArgs).toEqual({
        exe: 'ffmpeg',
        args: [
          '-i',
          'rtp://239.0.0.1:1234',
          '-codec',
          'copy',
          '-hls_flags',
          'delete_segments',
          'vivoh_media_relay/redirect.m3u8',
        ],
      });
    });

    it('should permit extras', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({
        extras: {extras: '-foobar -barfoo'},
        address,
      });
      expect(exeAndArgs).toEqual({
        exe: 'ffmpeg',
        args: [
          '-i',
          'rtp://239.0.0.1:1234',
          '-foobar',
          '-barfoo',
          'vivoh_media_relay/redirect.m3u8',
        ],
      });
    });
  });

  describe('#checkForFfmpeg', () => {
    it('should see if things work with faked make', (done) => {
      ffmpeg.checkForBinary({extras: {bin: 'make'}}).then((_) => {
        expect(true).toBeTruthy();
        done();
      });
    });

    it('should fail if binary is not real', (done) => {
      ffmpeg
          .checkForBinary({extras: {bin: '123123098091309138'}})
          .catch((_) => {
            expect(true).toBeTruthy();
            done();
          });
    });
  });
});
