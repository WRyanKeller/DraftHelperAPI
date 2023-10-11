const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/getRoster': jsonHandler.getRoster,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getRoster': jsonHandler.getRosterMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

const parseBody = (request, response, handler) => {
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  const body = [];

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addRoster') {
    parseBody(request, response, jsonHandler.addRoster);
  }
};

const handleGet = (request, response, parsedUrl, params) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response, params);
  }

  return urlStruct[request.method].notFound(request, response, params);
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  console.log(request.url);

  if (request.method === 'POST') {
    return handlePost(request, response, parsedUrl);
  }

  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  }

  const params = query.parse(parsedUrl.query);
  console.dir(params);
  return handleGet(request, response, parsedUrl, params);
};

http.createServer(onRequest).listen(port, () => {});
