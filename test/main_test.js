const {start} = require('../src/main');
const expect = require('expect');
const sinon = require('sinon');

describe('#main', () => {
  let hlsRun;
  let failure;

  beforeEach(() => {
    failure = sinon.spy();
    hlsRun = undefined;
  });

  it('should go into hls mode', () => {
    hlsRun = sinon.spy();
    start({type: 'hls'}, {hlsRun, failure});
    expect(hlsRun.callCount).toBe(1);
    expect(failure.callCount).toBe(0);
  });

  it('should need some kind of mode', () => {
    start({}, {failure});
    expect(failure.callCount).toBe(1);
  });
});
