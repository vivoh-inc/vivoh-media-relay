const React = require('react');
const {render} = require('ink-testing-library');
const importJsx = require('import-jsx');
const expect = require('expect');
const Server = importJsx('../src/ui/Server.jsx');
const Programs = importJsx('../src/ui/Programs.jsx');
const stripAnsi = require('strip-ansi');

describe('#ui', () => {
  describe('#Server', () => {
    it('should display off when nothing is provided', () => {
      const {lastFrame} = render(React.createElement(Server));
      const rendered = stripAnsi(lastFrame());
      expect(rendered).toEqual('Status: off');
    });
    it('should display on when server is on', () => {
      const {lastFrame} = render(React.createElement(Server, {on: true}));
      const rendered = stripAnsi(lastFrame());
      expect(rendered).toEqual('Status: on');
    });
  });

  describe('#Programs', () => {
    it('should display nothing when no programs are active', () => {
      const {lastFrame} = render(React.createElement(Programs));
      const rendered = stripAnsi(lastFrame());
      expect(rendered).toEqual('');
    });
    it('should display programs when active', () => {
      const programs = [
        {name: 'XYZ', id: '12314123'},
        {name: 'ABC', id: 123123213},
      ];
      const {lastFrame} = render(React.createElement(Programs, {programs}));
      const rendered = stripAnsi(lastFrame());
      expect(rendered).toEqual('XYZ [12314123] \nABC [123123213] ');
    });
  });
});
