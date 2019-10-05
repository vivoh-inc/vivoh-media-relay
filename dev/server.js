const express = require('express');
const app = express();

const argv = require('minimist')(process.argv.slice(2));

useJson = true;
if (argv.txt) {
  useJson = false;
}

const port = 9090;
let on = false;
app.get('/', (req, res) => {
  console.log( `${(new Date()).toString()}: /`);
  useJson ? res.json({on})
    : res.send(on ? 'on' : 'off');
});

app.get('/ffmpeg', (_, res) => {
  console.log( `${(new Date()).toString()}: /ffmpeg`, );
  const response = { on, mcastUrl: 'rtp://239.0.0.1:1234', programId: '12345'};
  res.json(response);
});

app.listen(port, '0.0.0.0', () => console.log('Sample server ready'));

console.log('"q" to quit, "o" to toggle on or off');

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', function(chunk, key) {
  // process.stdout.write('Get Chunk: ' + chunk + '\n');
  if (key && key.name == 'q') {
    console.log('Exiting...');
    process.exit();
  } else if (key && key.name === 'o') {
    on = !on;
    console.log(`Broadcast is ${on ? 'on' : 'off'}`);
  }
});
