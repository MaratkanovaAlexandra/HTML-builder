const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(__dirname + '/project-dist/bundle.css', {encoding: 'utf8'});
const styles = [];

fs.readdir(__dirname + '/styles/', (err, files) => {
  const cssFiles = files.filter(file => path.extname(file) === '.css');
  let length = cssFiles.length;
  cssFiles.forEach(file => {
    fs.lstat(`${__dirname}/styles/${file}`, (err, stat) => {
      if(!stat.isDirectory()) {
        const readStream = fs.createReadStream(__dirname + `/styles/${file}`, {encoding: 'utf8'});
        readStream.on('data', (data) => {
          styles.push(data);
          if (length === styles.length) {
            writeStream.write(styles.join('\n'));
          }
        });
      } else {
        length -= 1;
      }
    });
  });
});
