const {processConfig, DEFAULT_POLLING_TIME} = require('../src/config');
const expect = require('expect');

describe('#config', () => {
  it('process a config generally', () => {
    const args = {
      l: 'fdgds/sdfsfd',
      d: 'abc',
    };
    const config = processConfig(args);
    expect(config).toBeTruthy();
  });

  describe('#segmenter', () => {
    it( 'should get the ffmpeg ', () => {
      const config = processConfig({});
      expect(config.segmenterName).toBe('ffmpeg');
    });

    it( 'should get tsduck if we ask for it ', () => {
      const config = processConfig({s: 'tsduck'});
      expect(config.segmenterName).toBe('tsduck');
      expect(config.segmenter.checkForBinary).toBeTruthy();
    });

    it( 'should get ffmpeg if we ask for it ', () => {
      const config = processConfig({s: 'ffmpeg'});
      expect(config.segmenterName).toBe('ffmpeg');
      expect(config.segmenter.checkForBinary).toBeTruthy();
    });
  });

  describe('#extras', () => {
    it( 'should get the ffmpeg extras ', () => {
      const config = processConfig({ ffmpegExtras: '-b -c', ffmpegBin: 'ffmpeg.exe'});
      expect(config.extras.extras).toBe('-b -c');
      expect(config.extras.bin).toBe('ffmpeg.exe');
    });
  
    it( 'should get the tsduck extras ', () => {
      const config = processConfig({ s: 'tsduck', tsduckExtras: '-b -c', tsduckBin: 'tsduck.APP'});
      expect(config.extras.extras).toBe('-b -c');
      expect(config.extras.bin).toBe('tsduck.APP');
    });
  });

  describe('#ipAddress', () => {
    it('should get 0.0.0.0 by default', () => {
      const config = processConfig({});
      expect(config.ipAddress).toBe('0.0.0.0');
    });

    it('should allow specifying it', () => {
      const config = processConfig({i: '192.168.1.1'});
      expect(config.ipAddress).toBe('192.168.1.1');
    });
  });

  it('should get the port correctly, either string or not', () => {
    const config = processConfig({p: '7777'});
    expect(config.port).toBe(7777);
    const config2 = processConfig({p: 7777});
    expect(config2.port).toBe(7777);
  });

  it('should get ffmpeg by default', () => {
    const args = {};
    const config = processConfig(args);
    expect(config.segmenter.name).toBe('ffmpeg');
  });

  it('should support polling args', () => {
    const args = {t: 345, u: 'http://polling.com/foo.json'};
    const config = processConfig(args);
    // Convert to seconds
    expect(config.poll.time).toBe(345);
    expect(config.poll.url).toBe('http://polling.com/foo.json');
  });

  it('should have def polling time if polling server is on', () => {
    const args = {u: 'http://polling.com/foo.json'};
    const config = processConfig(args);
    expect(config.poll.time).toBe(DEFAULT_POLLING_TIME);
  });
});
