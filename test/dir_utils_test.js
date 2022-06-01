// const assert = require('assert');
const tmp = require('tmp');
const path = require('path');
const fs = require('fs');
const dirUtils = require( '../src/dir_utils');
const expect = require('expect');
const sinon = require( 'sinon');
let failure;

describe( 'dirUtils', () => {
  let tmpobj = undefined;

  const createThreeTsFiles = () => {
    tmpobj = tmp.dirSync();
    [1, 2, 3].forEach( (i) => {
      fs.writeFileSync( path.join( tmpobj.name, `${i}.ts` ), 'abc' );
    });
  };

  describe( 'isNotReady', () => {
    it( 'should signal false when nothing exists', (done) => {
      dirUtils.isReadyToView(tmp.dirSync().name)
          .then( (b) => {
            expect(b).toBeFalsy();
            done();
          })
          .catch( (err) => {
            console.log( 'Error: ', err );
            done();
          });
    });
  });

  describe( 'isReady', () => {
    beforeEach( () => {
      createThreeTsFiles();
    });

    it( 'should signal true when three ts files exist in the directory', (done) => {
      dirUtils.isReadyToView(tmpobj.name)
          .then( (b) => {
            expect(b).toBeTruthy();
            done();
          })
          .catch( (err) => {
            done();
          });
    });
  });


  describe( 'checkForDirectory', () => {
    beforeEach( () => {
      failure = sinon.spy();
      createThreeTsFiles();
    });

    it( 'should signal false when three ts files exist in the directory', (done) => {
      dirUtils.checkForDirectory(tmpobj.name, failure)
          .then( (b) => {
            expect(b).toBeFalsy();
            expect(failure.callCount).toBe(1);
            done();
          });
    });

    it( 'should signal true when three ts files exist in the directory if we are ignoring it', (done) => {
      dirUtils.checkForDirectory(tmpobj.name, failure, true)
          .then( (b) => {
            expect(b).toBeTruthy();
            expect(failure.callCount).toBe(0);
            done();
          });
    });
  });

  describe( 'fixDirectory', () => {
    it( 'should fix a directory', () => {
      expect(dirUtils.fixDirectory( 'foo/bar'))
          .toEqual(require('path').join( __dirname, '..', '/foo/bar'));
    });
  });
});
