// const assert = require('assert');
const tmp = require('tmp');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const vlc = require('../src/vlc');
const ffmpeg = require('../src/ffmpeg');
const expect = require('expect');

describe( '#segmenters', () => {
  [vlc, ffmpeg].forEach( (s) => {
    it(`should return false when ${s.name} is not running`, (done) => {
      s.isRunning('udp://239.0.0.1:1234')
          .then( (b) => {
            expect( b ).toBeFalsy();
            done();
          });
    });
  });
});
