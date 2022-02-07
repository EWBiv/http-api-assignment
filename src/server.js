const http = require('http');
const url = require('url');

const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Called when they make a request to server
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.log(parsedUrl.pathname);

  // make an array of the accepted type(s) given
  const acceptedTypes = request.headers.accept.split(',');
  // console.log(acceptedTypes);

  switch (parsedUrl.pathname) {
    case '/':
      responseHandler.getIndex(request, response);
      break;
    case '/style.css':
      responseHandler.getCSS(request, response);
      break;
    case '/success':
      responseHandler.success(request, response, acceptedTypes);
      break;
    case '/badRequest':
      responseHandler.validCheck(request, response, acceptedTypes);
      break;
    case '/unauthorized':
      responseHandler.loggedInCheck(request, response, acceptedTypes);
      break;
    case '/forbidden':
      responseHandler.forbidden(request, response, acceptedTypes);
      break;
    case '/internal':
      responseHandler.internal(request, response, acceptedTypes);
      break;
    case '/notImplemented':
      responseHandler.notImplemented(request, response, acceptedTypes);
      break;
    default:
      responseHandler.notFound(request, response, acceptedTypes);
      break;
  }
};

// Setting up server + its callback function when setup
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1${port}`);
});
