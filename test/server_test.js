const {
  // startServer,
  processReponse,
  run,
  checkPollServerForStatus,
} = require('../src/server');
const expect = require('expect');
const sinon = require('sinon');

describe('#server', () => {
  let myCheckPollServerForStatus;
  let myStartServer;

  beforeEach(() => {
    myStartServer = sinon.spy();
    myCheckPollServerForStatus = sinon.spy();
  });

  it('should start server if no polling', () => {
    run(
        {},
        {
          _startServer: myStartServer,
          _checkPollServerForStatus: myCheckPollServerForStatus,
        }
    );
    expect(myStartServer.callCount).toBe(1);
    expect(myCheckPollServerForStatus.callCount).toBe(0);
  });

  it('should start polling if polling on', () => {
    run(
        {poll: {url: 'http://poller.com/foo.json', time: 100}},
        {
          _startServer: myStartServer,
          _checkPollServerForStatus: myCheckPollServerForStatus,
        }
    );
    expect(myStartServer.callCount).toBe(0);
    expect(myCheckPollServerForStatus.callCount).toBe(1);
  });

  it('should process the response for complex JSON', () => {
    const processed = processReponse({data: {on: true, type: 'redirect'}});
    expect(processed.isOn).toBeTruthy();
    expect(processed.redirect).toBeTruthy();
  });

  it('should process the response for complex JSON when off', () => {
    const processed = processReponse({data: {}});
    expect(processed.isOn).toBeFalsy();
  });

  it('should process the response for simple text with on', () => {
    const processed = processReponse({data: 'on'});
    expect(processed.isOn).toBeTruthy();
  });

  it('should process the response for simple text when off', () => {
    const processed = processReponse({data: 'off'});
    expect(processed.isOn).toBeFalsy();
  });

  describe('#checkPollServer', () => {
    let _setTimeout;
    let _processResponse;

    beforeEach(() => {
      _setTimeout = sinon.spy();
      _processResponse = sinon.stub();
    });

    it('should check the poll server and process the result', (done) => {
      const response = {data: 'on'};
      const _axios = {get: sinon.stub().resolves(response)};
      const _startServer = sinon.spy();
      _processResponse.returns({isOn: true});
      const testOverrides = {
        _setTimeout,
        _processResponse,
        _axios,
        _startServer,
        _loop: false,
      };
      checkPollServerForStatus(
          {poll: {url: 'http://foobar.com/foo.json'}},
          testOverrides
      ).then((_) => {
        // expect( _processResponse.callCount).toBe(1);
        expect(_startServer.callCount).toBe(1);
        done();
      });
    });

    it('should check the poll server and not process if off', () => {
      const response = {data: 'off'};
      const _axios = {get: sinon.stub().resolves(response)};
      const _stopServer = sinon.spy();
      _processResponse.returns({isOn: false});
      const testOverrides = {
        _setTimeout,
        _processResponse,
        _axios,
        _stopServer,
        _loop: false,
      };
      checkPollServerForStatus(
          {poll: {url: 'http://foobar.com/foo.json'}},
          testOverrides
      ).then((_) => {
        // expect( _processResponse.callCount).toBe(1);
        expect(_stopServer.callCount).toBe(1);
      });
    });

    it('should check the poll server and fail to process if server in error', () => {
      const _setTimeout = sinon.spy();
      const _axios = {};
      const _processResponse = sinon.spy();
      const _stopServer = sinon.spy();
      _axios.get = sinon.stub().rejects(undefined);
      checkPollServerForStatus(
          {poll: {url: 'http://foobar.com/foo.json'}},
          {_setTimeout, _axios, _processResponse, _stopServer, _loop: false}
      ).then((_) => {
        expect(_processResponse.callCount).toBe(0);
        expect(_stopServer.callCount).toBe(1);
      });
    });
  });

  describe( '#processResponse', () => {
    it( 'should be on if response is on', () => {
      const response = processReponse( {data: {on: true}} );
      expect( response.isOn).toBe(true);
    });

    it( 'should be contain extra information if response', () => {
      const response = processReponse( {data: {on: true, mcastUrl: 'udp://239.0.0.1:1234'}} );
      expect( response.isOn).toBe(true);
      expect( response.mcastUrl).toBe('udp://239.0.0.1:1234');
    });
  });
});
