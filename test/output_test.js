// const React = require('react');
// const { render } = require('ink-testing-library');
const expect = require('expect');
// const Server = require('../src/ui/Server');
// const Programs = require('../src/ui/Programs.js');
// const stripAnsi = require('strip-ansi');

xdescribe('#ui', () => {
    describe('#Server', () => {
        it('should display off when nothing is provided', () => {
            const { lastFrame } = render(React.createElement(Server, { server: {} }));
            const rendered = stripAnsi(lastFrame());
            expect(rendered).toEqual('Server status: off\n\n');
        });
        it('should display on when server is on', () => {
            const config = { url: 'udp://239.0.0.1:1234', port: 4567 };
            const { lastFrame } = render(React.createElement(Server, { server: { on: true, config } }));
            const rendered = stripAnsi(lastFrame());
            const msg = `Server status: listening on 4567`;
            expect(rendered.trim()).toEqual(msg.trim());
        });
    });

    describe('#Programs', () => {
        it('should display nothing when no programs are active', () => {
            const { lastFrame } = render(React.createElement(Programs));
            const rendered = stripAnsi(lastFrame());
            expect(rendered).toEqual('');
        });
        xit('should display programs when active', () => {
            const programs = [
                { name: 'XYZ', id: '12314123' },
                { name: 'ABC', id: 123123213 },
            ];
            const { lastFrame } = render(React.createElement(Programs, { programs }));
            const rendered = stripAnsi(lastFrame());
            expect(rendered).toEqual('XYZ [12314123] \nABC [123123213] ');
        });
    });
});