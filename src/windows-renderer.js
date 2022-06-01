var blessed = require('blessed');

let box;
let screen;
let program;

function boot() {
    // Create a screen object.
    screen = blessed.screen({
        smartCSR: true,
    });

    program = blessed.program();

    screen.title = 'my window title';

    // Create a box perfectly centered horizontally and vertically.
    box = blessed.box({
        top: 'center',
        left: 'center',
        width: '50%',
        height: '50%',
        // content: 'Hello {bold}world{/bold}!\nok\n\no more\nagain\nyeah\ngoodone',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'lightgreen',
            border: {
                fg: '#f0f0f0'
            },
        }
    });

    screen.append(box);

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
    });

    // Render the screen.
    screen.render();
}

const windowsRenderer = {
    banner: (m) => {
        box.setLine(0, m);
        screen.render();
    },
    message: (m) => {
        box.setLine(2, m);
        screen.render();
    },
    errors: (m) => {
        box.setLine(4, m);
        screen.render();
    },
    poll: (m) => {
        box.setLine(6, m);
        screen.render();
    },
    server: (m) => {
        box.setLine(8, `Server status: ${m.on ? 'ON' : 'OFF' }`);
        screen.render();
    },
    updateSegmenter: (m) => {
        box.setLine(10, m);
        screen.render();
    },
};

module.exports.windowsRenderer = windowsRenderer;
module.exports.boot = boot;