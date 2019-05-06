const ffmpeg = require('../src/ffmpeg');
const expect = require('expect');

const rtpMcastAddress = 'rtp://239.0.0.1:1234';

describe( '#ffmpeg', () => {
  describe( 'gets the correct arguments', () => {
    it( 'should give back nothing when no args / empty object provided', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg();
      expect(exeAndArgs).toEqual({});
      const exeAndArgs2 = ffmpeg.getArgumentsForFfmpeg({});
      expect(exeAndArgs2).toEqual({});
    });

    it( 'should work with just the address', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({address: rtpMcastAddress});
      expect(exeAndArgs).toEqual({'exe': 'ffmpeg',
        'args':
            ['-i', 'rtp://239.0.0.1:1234',
              '-c', 'copy', '-f', 'flv',
              '-bsf:a',
              'aac_adtstoasc',
              'rtmp://localhost/rtp/239_0_0_1__1234']});
    });

    it( 'should allow specifying the rtmp port', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({address: rtpMcastAddress, rtmpPort: 1936});
      expect(exeAndArgs).toEqual({'exe': 'ffmpeg',
        'args':
            ['-i', 'rtp://239.0.0.1:1234',
              '-c', 'copy', '-f', 'flv',
              '-bsf:a',
              'aac_adtstoasc',
              'rtmp://localhost:1936/rtp/239_0_0_1__1234']});
    });


    it( 'should permit extras', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg(
          {extras: {extras: '-foobar -barfoo'},
            address: rtpMcastAddress,
            dontAddAacSwitches: true});
      expect(exeAndArgs).toEqual(
          {'exe': 'ffmpeg',
            'args':
                  ['-i', 'rtp://239.0.0.1:1234', '-foobar', '-barfoo',
                    '-c', 'copy', '-f', 'flv',
                    'rtmp://localhost/rtp/239_0_0_1__1234']});
    });

    it( 'should turn off aac switches when specified', () => {
      const exeAndArgs = ffmpeg.getArgumentsForFfmpeg({address: rtpMcastAddress, dontAddAacSwitches: true});
      expect(exeAndArgs).toEqual(
          {'exe': 'ffmpeg',
            'args':
                ['-i', 'rtp://239.0.0.1:1234', '-c', 'copy', '-f', 'flv',
                  'rtmp://localhost/rtp/239_0_0_1__1234']});
    });
  });
});
