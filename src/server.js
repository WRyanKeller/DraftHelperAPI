const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

/*
Summary:
- routes urls to their desired actions
*/
const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/getRoster': jsonHandler.getRoster,
    '/getArt': jsonHandler.getArt,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getRoster': jsonHandler.getRosterMeta,
    '/getArt': jsonHandler.getArtMeta,
    notFound: jsonHandler.notFoundMeta,
  },
  POST: {
    '/addRoster': jsonHandler.addRoster,
    '/addMon': jsonHandler.addMon,
    '/removeMon': jsonHandler.removeMon,
    notFound: jsonHandler.notFound,
  },
};

/*
Summary:
- parses data provided by post requests
*/
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

    if (bodyParams.roster) {
      bodyParams.roster = JSON.parse(bodyParams.roster);
    }
    return handler(request, response, bodyParams);
  });
};

/*
Summary:
- handles posts requests by looking for their handler and then passing them to parse body
*/
const handlePost = (request, response, parsedUrl) => {
  if (urlStruct.POST[parsedUrl.pathname]) {
    return parseBody(request, response, urlStruct.POST[parsedUrl.pathname]);
  }

  return urlStruct.POST.notFound(request, response);
};

/*
Summary:
- handles get and head requests by routing them to their handlers
*/
const handleGet = (request, response, parsedUrl, params) => {
  if (urlStruct[request.method][parsedUrl.pathname]) {
    return urlStruct[request.method][parsedUrl.pathname](request, response, params);
  }

  return urlStruct[request.method].notFound(request, response, params);
};

/*
Summary:
- called upon receiving a request to the server
- differentiates between get and post calls
*/
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    return handlePost(request, response, parsedUrl);
  }

  if (!urlStruct[request.method]) {
    return urlStruct.HEAD.notFound(request, response);
  }

  const params = query.parse(parsedUrl.query);
  return handleGet(request, response, parsedUrl, params);
};

http.createServer(onRequest).listen(port, () => {});
