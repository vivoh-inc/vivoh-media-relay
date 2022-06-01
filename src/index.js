const { processConfig } = require('./config');
const { run } = require('./server');
const processedArguments = require('minimist')(process.argv.slice(2));
const o = require('./output');
const { usage } = require('./usage');
const { windowsRenderer, boot } = require('./windows-renderer');
// Update path to add cwd
process.env.PATH = `${process.env.PATH}:.`;

// const app = require('./cli').app;

const startFn = (renderer) => {
    boot();
    o.setRenderer(windowsRenderer);
    const config = processConfig(processedArguments);
    config.segmenter
        .checkForBinary(config)
        .then((_) => {
            o.banner();
            if (!config.valid) {
                usage();
            } else {
                run(config);
            }
        })
        .catch((_) => {
            o.errors('An error occurred running the segmenter' + _);
        });
};

// app(
startFn();
// );