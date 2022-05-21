const fs = require('fs');
const path = require('path');

fs.rm(__dirname + '/project-dist/', { recursive: true, force: true }, () => {
  fs.mkdir(__dirname + '/project-dist/', () => {
    fs.readdir(__dirname + '/', (err, files) => {
      files.forEach(file => {

        if(file === 'assets') fs.mkdir(__dirname + '/project-dist/', () => {
          fs.readdir(__dirname + '/assets', (assetsErr, assetsFiles) => {
            fs.mkdir(__dirname + '/project-dist/assets/', () => {
              assetsFiles.forEach(assetDir => {
                fs.readdir(__dirname + `/assets/${assetDir}`, (err, assets) => {
                  assets.forEach(asset => {
                    fs.mkdir(__dirname + `/project-dist/assets/${assetDir}/`, () => {
                      const readStream = fs.createReadStream(__dirname + `/assets/${assetDir}/${asset}`);
                      const writeStream = fs.createWriteStream(__dirname + `/project-dist/assets/${assetDir}/${asset}`);
                      readStream.on('data', (data) => {
                        writeStream.write(data);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      
        if(file === 'styles') {
          const writeStream = fs.createWriteStream(__dirname + '/project-dist/style.css', {encoding: 'utf8'});
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
        }

        if(path.extname(file) === '.html' ) {          
          const htmlReadStream = fs.createReadStream(__dirname+ '/template.html', {encoding: 'utf8'});

          htmlReadStream.on('data', (data) => {
            let html = data;
            const components = [];
            let lastIndex = 0;
            while (lastIndex  !== -1) {
              lastIndex = html.indexOf('{{', lastIndex + 1);
              const name = html.substring(lastIndex+2, html.indexOf('}}', lastIndex + 1));
              if(!name.includes(' '))
                components.push(name);
            }

            fs.readdir(__dirname + '/components/', (err, files) => {
              components.forEach((component) => {
                if (files.find((file) => file === `${component}.html`)) {
                  const componentReadStream = fs.createReadStream(__dirname+ `/components/${component}.html`, {encoding: 'utf8'});
                  componentReadStream.on('data', (data) => {
                    html = html.replace(`{{${component}}}`, data);
                    if (!html.includes('{{')) {
                      const writeStream = fs.createWriteStream(__dirname + '/project-dist/index.html', {encoding: 'utf8'});
                      writeStream.write(html);
                    }
                  });
                } else {
                  html = html.replace(`{{${component}}}`, '');
                }
              });
            });
          });
        }

      });
    });
  });
});
