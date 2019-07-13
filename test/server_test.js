const { startServer, processReponse, run, checkPollServerForStatus } = require('../src/server');
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
        {pollUrl: 'http://poller.com/foo.json', pollTime: 100},
        {
          _startServer: myStartServer,
          _checkPollServerForStatus: myCheckPollServerForStatus,
        }
    );
    expect(myStartServer.callCount).toBe(0);
    expect(myCheckPollServerForStatus.callCount).toBe(1);
  });

  it('should process the response for complex JSON', () => {
    const processed = processReponse({data:{on: true, type:'redirect'}});
    expect( processed.isOn).toBeTruthy();
    expect( processed.redirect).toBeTruthy();
  });

  it('should process the response for complex JSON when off', () => {
    const processed = processReponse({data:{}});
    expect( processed.isOn).toBeFalsy();
  });


  it( 'should process the response for simple text with on', () => {
    const processed = processReponse({data:'on'});
    expect( processed.isOn).toBeTruthy();
  });

  it( 'should process the response for simple text when off', () => {
    const processed = processReponse({data:'off'});
    expect( processed.isOn).toBeFalsy();
  });

  describe('#checkPollServer', () => {
    it('should check the poll server', () => {
      const _setTimeout = sinon.spy();
      const _startServer = sinon.spy();

      checkPollServerForStatus( {pollUrl: 'http://foobar.com/foo.json'},
          {_setTimeout, _startServer});

      
    })
  })

});
