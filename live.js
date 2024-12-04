const gen = require('./tasks/generateHTML');
const express = require('express');
const app = express();
const port = 5758;

app.use('/assets', express.static('assets'));
app.use('/static', express.static('public'));

app.get('/*', (req, res) => {
  render(req,res);
});

const render = (req, res) => {
  if (req.url.startsWith('/assets')) return;
  let wantedPage = req.url.replace('/', '');
  if (wantedPage === '') wantedPage = 'index';

  const indexTemplate = gen.parseForFile(wantedPage, 'live');

  res.send(indexTemplate);
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});