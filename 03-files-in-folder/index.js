const fs = require('fs');
const path = require('path');

fs.readdir(__dirname + '/secret-folder/', (err, files) => {
  files.forEach(file => {
    fs.lstat(`${__dirname}/secret-folder/${file}`, (err, stat) => {
      if(!stat.isDirectory()) {
        const extension = path.extname(file);
        const name = path.basename(file, extension);
        const size = stat.size;

        console.log(`${name} - ${extension.slice(1)} - ${size/1000}kb`);
      }
    });
  });
});
