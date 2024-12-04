
const gen = require('./tasks/generateHTML');

const fs = require('fs');
const path = require('path');

const marked = require('marked');


if(!fs.existsSync('./public')) fs.mkdirSync('./public');

if(!fs.existsSync('./public/assets')) fs.mkdirSync('./public/assets');
fs.readdirSync('./assets').forEach(file => {
  fs.copyFileSync(`./assets/${file}`, `./public/assets/${file}`);
});

fs.readdirSync('./media').forEach(file => {
  if (!file.endsWith('.md')) return;
  console.log(`Generating ${file.replace('.md', '')}.html`);
  let wantedPage = file.replace('.md', '');
  if(wantedPage === '') wantedPage = 'index';
  
  let out = marked.parse(gen.generateHtmlFor(wantedPage));
  console.log("- Generated HTML for " + wantedPage);
  let indexTemplate = gen.generateHtmlFor('templates/index', '.html', true); // Include sections
  console.log("- Generated index.html template");
  indexTemplate = gen.minify(indexTemplate);
  indexTemplate = indexTemplate.replace('<&freewiki:page />', out);
  console.log("- Replaced index content");

  
  console.log('\u2713 Generated ' + wantedPage + '.html');
  console.log('\u2713 Sent ' + wantedPage + '.html');
  console.groupEnd();
  if(!fs.existsSync(`./public/${wantedPage}`)) fs.mkdirSync(`./public/${wantedPage}`);
  fs.writeFileSync(`./public/${wantedPage}/index.html`, indexTemplate);
  if(wantedPage === 'index') {
    fs.writeFileSync(`./public/index.html`, indexTemplate);
  }
});