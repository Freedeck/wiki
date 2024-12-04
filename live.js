const gen = require('./tasks/generateHTML');

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 5758;

app.use('/assets', express.static('assets'));
app.use('/static', express.static('public'));

const marked = require('marked');



app.get('/*', (req, res) => {
  render(req,res);
});

const render = (req, res) => {
  if (req.url.startsWith('/assets')) return;
  let wantedPage = req.url.replace('/', '');
  console.group("* Generating " + wantedPage)
  if (wantedPage === '') wantedPage = 'index';
  
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
  res.send(indexTemplate);
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});