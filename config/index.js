// We reuse this import in order to have access to the `body` property in requests
const express = require("express");

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  //You DO NOT NEED express.json() and express.urlencoded() for GET Requests or DELETE Requests.
  //You NEED express.json() and express.urlencoded() for POST and PUT requests, because in both these requests you are sending data (in the form of some data
  // object) to the server and you are asking the server to accept or store that data (object), which is enclosed in the body (i.e. req.body) of that (POST or
  // PUT) Request
  //Alternatively, use Body Parser.
  /* // calling body-parser to handle the Request Object from POST requests
  let bodyParser = require('body-parser');
  // parse application/json, basically parse incoming Request Object as a JSON Object 
  app.use(bodyParser.json());
  // parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
  app.use(bodyParser.urlencoded({ extended: false }));
  // combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
  app.use(bodyParser.urlencoded({ extended: true }));*/

  // Normalizes the path to the views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // Sets the view engine to handlebars
  app.set("view engine", "hbs");
  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Handles access to the favicon
  app.use(favicon(path.join(__dirname, "..", "public", "images", "favicon.ico")));
};