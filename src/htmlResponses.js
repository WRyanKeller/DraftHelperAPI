const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../bundle/bundle.js`);

/*
Summary:
- returns index.html
*/
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

/*
Summary:
- returns style.css
*/
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

/*
Summary:
- returns bundle.js
*/
const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(bundle);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getBundle,
};
