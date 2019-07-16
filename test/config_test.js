const {processConfig, DEFAULT_POLLING_TIME} = require('../src/config');
const expect = require('expect');

describe('#config', () => {
  it('process a config generally', () => {
    const args = {
      l: 'fdgds/sdfsfd',
      d: 'abc'
    };
    const config = processConfig(args);
    expect(config).toBeTruthy();
  });

  describe('#ipAddress', () => {
    it('should get 0.0.0.0 by default', () => {
      const config = processConfig({});
      expect(config.ipAddress).toBe('0.0.0.0');
    });

    it('should allow specifying it', () => {
      const config = processConfig({ i: '192.168.1.1' });
      expect(config.ipAddress).toBe('192.168.1.1');
    });
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
    expect(config.pollingTime).toBe(345*1000);
    expect(config.pollUrl).toBe('http://polling.com/foo.json');
  });

  it('should have def polling time if polling server is on', () => {
    const args = {u: 'http://polling.com/foo.json'};
    const config = processConfig(args);
    expect(config.pollingTime).toBe(DEFAULT_POLLING_TIME*1000);
  });
});
