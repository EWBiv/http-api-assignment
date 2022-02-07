const fs = require('fs');
const url = require('url');
const query = require('querystring');

// Preloaded files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Objects used for making JSON/XML objects

const createJSONMessage = (isError, msg, errorID) => {
  const json = { };
  json.message = msg;
  if (isError) json.id = errorID;
  return json;
};

const createXMLMessage = (isError, msg, errorID) => {
  let xml = '<response>';
  xml += `<message>${msg}</message>`;

  if (isError) {
    xml += `<id>${errorID}</id>`;
  }
  xml += '</response>';
  return xml;
};

const respondJSON = (request, response, status, json) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(json));
  response.end();
};

// I realize this is nearly the same as the respond JSON, but unfortunately I forgot if XML was
// much different until the final stages - hopefully it isn't too bad to have them seperate!
const respondXML = (request, response, status, xml) => {
  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(xml);
  response.end();
};

// Creates XML or JSON depending on acceptedType and responds with said type
const createMsgAndRespond = (isError, msg, errorID, request, response, status, acceptedTypes) => {
  let m;
  if (acceptedTypes[0] === 'text/xml') {
    m = createXMLMessage(isError, msg, errorID);
    respondXML(request, response, status, m);
  } else {
    m = createJSONMessage(isError, msg, errorID);
    respondJSON(request, response, status, m);
  }
};

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end(); //  cannot .write() after .end()
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const success = (request, response, acceptedTypes) => {
  createMsgAndRespond(false, 'Success', '', request, response, 200, acceptedTypes);
};

const validCheck = (request, response, acceptedTypes) => {
  const parsedUrl = url.parse(request.url);
  const queryObj = query.parse(parsedUrl.query);

  let status;
  let message;

  if (queryObj.valid && queryObj.valid === 'true') {
    status = 200;
    message = 'Success';
    createMsgAndRespond(false, message, '', request, response, status, acceptedTypes);
  } else {
    status = 400;
    message = 'Not Valid. Bad request!';
    createMsgAndRespond(true, message, 'badRequest', request, response, status, acceptedTypes);
  }
};

const loggedInCheck = (request, response, acceptedTypes) => {
  const parsedUrl = url.parse(request.url);
  const queryObj = query.parse(parsedUrl.query);

  let status;
  let message;

  if (queryObj.loggedIn && queryObj.loggedIn === 'yes') {
    status = 200;
    message = 'Success';
    createMsgAndRespond(false, message, '', request, response, status, acceptedTypes);
  } else {
    status = 401;
    message = 'Unauthorized request! Not Logged In. Need to be logged in to access page.';
    createMsgAndRespond(true, message, 'unauthorized', request, response, status, acceptedTypes);
  }
};

const forbidden = (request, response, acceptedTypes) => {
  createMsgAndRespond(true, 'Forbidden page! You do not have access to this page.', 'forbidden', request, response, 403, acceptedTypes);
};

const internal = (request, response, acceptedTypes) => {
  createMsgAndRespond(true, 'Internal Server Issue.', 'serverError', request, response, 500, acceptedTypes);
};

const notImplemented = (request, response, acceptedTypes) => {
  createMsgAndRespond(true, 'Page not Implemented yet!', 'pageNotImplemented', request, response, 501, acceptedTypes);
};

const notFound = (request, response, acceptedTypes) => {
  createMsgAndRespond(true, 'Page not found!', 'pageNotFound', request, response, 404, acceptedTypes);
};

// Exports

module.exports = {
  getIndex,
  getCSS,
  success,
  validCheck,
  loggedInCheck,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
