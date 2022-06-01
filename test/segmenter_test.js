// const assert = require('assert');
const ffmpeg = require('../src/ffmpeg');
const expect = require('expect');

describe('#segmenters', () => {
  it('should return false when ffmpeg is not running', (done) => {
    ffmpeg.isRunning('udp://239.0.0.1:1234').then((b) => {
      expect(b).toBeFalsy();
      done();
    });
  });
});
