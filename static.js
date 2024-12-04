const gen = require('./tasks/generateHTML');

const fs = require('fs');

if(!fs.existsSync('./public')) fs.mkdirSync('./public');

if(!fs.existsSync('./public/assets')) fs.mkdirSync('./public/assets');
fs.readdirSync('./assets').forEach(file => {
  fs.copyFileSync(`./assets/${file}`, `./public/assets/${file}`);
});

fs.readdirSync('./media').forEach(file => {
  if (!file.endsWith('.md')) {
    if(file == 'templates') return;
    fs.readdirSync('./media/' + file).forEach((fileTwo) => {
      if (!fileTwo.endsWith('.md')) return;
      let wantedPageTwo = fileTwo.replace('.md', '');
      if(wantedPageTwo === '') wantedPageTwo = 'index';
      gen.parseForFile(file+"/"+wantedPageTwo, 'static');
    })
  };
  console.group(`Generating ${file.replace('.md', '')}.html`);
  let wantedPage = file.replace('.md', '');
  if(wantedPage === '') wantedPage = 'index';
  gen.parseForFile(wantedPage, 'static')
 
  console.log("\u2713 Completed parsing for " + wantedPage);
  console.groupEnd();
  console.log()
});