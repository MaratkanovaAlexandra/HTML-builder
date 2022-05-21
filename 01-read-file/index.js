const fs = require('fs');

const stream = fs.createReadStream(__dirname + '/text.txt', {encoding: 'utf8'});
stream.on('data',(dataChunk) => console.log(dataChunk));
