const processFilter = require( '../src/process_filter');
const fixtures = require('./process_fixture');
const expect = require('expect');

it( 'should get a process by pid', () => {
  expect(processFilter.pidIsRunning(fixtures, 32450)).toBeTruthy();
});

it( 'should fail if process does not exist', () => {
  expect(processFilter.pidIsRunning([{pid: 123}], 32450)).toBeFalsy();
});

it( 'should not crash', () => {
  expect(processFilter.pidIsRunning(null, 32450)).toBeFalsy();
  expect(processFilter.pidIsRunning(undefined, 32450)).toBeFalsy();
  expect(processFilter.pidIsRunning([{a: 'b'}], 32450)).toBeFalsy();
  expect(processFilter.pidIsRunning([], 32450)).toBeFalsy();
});


