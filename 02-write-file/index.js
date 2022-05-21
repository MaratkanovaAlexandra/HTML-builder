const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });
const stream = fs.createWriteStream(__dirname + '/text.txt', {encoding: 'utf8'});

console.log('Write some line:');

rl.on('line', (answer) => {
  if (answer === 'exit') {
    rl.close();
  } else {
    console.log('Write some more line:');
    stream.write(`${answer}\n`);
  }
});

rl.on('close', function () {
  stream.end();
  console.log('this is end of input');
  process.exit(0);
});
