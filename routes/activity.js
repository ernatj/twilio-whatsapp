'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');
var request = require('request');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    // console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    // var phoneNumberValue = document.getElementById("form-element-01");
    // var messageValue = document.getElementById("textarea-id-01");

    // console.log( req.body );
    // console.log(phoneNumberValue);
    // console.log(messageValue);
    // console.log( req.body)
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    console.log("EXECUTE FUNCTION START")
    console.log("=======================")
    
    // decoded in arguments
    // const accountSid = 'ACb494ea5723f3f2f591bbc092b094d41d'; 
    // const authToken = '922353ff86ab2d2b8289d7c7fcf9f78d'; 

    const axios = require('axios');
    const qs = require('querystring');
    // require('dotenv').config();
    
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const accountId = process.env.TWILIO_ACCOUNT_SID
    
    axios.post("https://api.twilio.com/2010-04-01/Accounts/"+accountId+"/Messages.json", {
      'Body': 'Hello ini dari node.js biasa',
      'From': 'whatsapp:+14155238886',
      'To': 'whatsapp:+6285719752942',
    }, {
      auth: {
        username: accountId,
        password: authToken
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log('Auth '+authToken+' Account SID '+accountId);
      console.log(error);
    }) 

    console.log(req.body)
    logData(req);
    console.log("=======================")
    console.log("EXECUTE FUNCTION STOP")
    res.send(200, 'Execute');
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    // console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    // console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};