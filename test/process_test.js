const process_filter = require( '../src/process_filter');
const fixtures = require('./process_fixture');
const expect = require('expect');

it( 'should get a process by pid', () => {
  expect(process_filter.pidIsRunning(fixtures, 32450)).toBeTruthy();
});

it( 'should fail if process does not exist', () => {
  expect(process_filter.pidIsRunning([{pid: 123}], 32450)).toBeFalsy();
});

it( 'should not crash', () => {
  expect(process_filter.pidIsRunning(null, 32450)).toBeFalsy();
  expect(process_filter.pidIsRunning(undefined, 32450)).toBeFalsy();
  expect(process_filter.pidIsRunning([{a: 'b'}], 32450)).toBeFalsy();
  expect(process_filter.pidIsRunning([], 32450)).toBeFalsy();
});


