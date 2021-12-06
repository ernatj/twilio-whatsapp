"use strict";
var util = require("util");

// Deps
const Path = require("path");
const JWT = require(Path.join(__dirname, "..", "lib", "jwtDecoder.js"));
const axios = require("axios");
const qs = require("qs");
var http = require("https");
var request = require("request");
const { response } = require("express");

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
    originalUrl: req.originalUrl,
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
  res.status(200).send("Edit");
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
  res.status(200).send("Save");
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
  console.log("EXECUTE FUNCTION START");
  console.log("=======================");

  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const accountId = process.env.TWILIO_ACCOUNT_SID;

  var request_token = {
    'access_token': "",
    'rest_instance_url': ""
  }

  axios.post('https://mcx3dk6gqx05byn626r3yqc9-hl0.auth.marketingcloudapis.com/v2/token', {
    "Content-type": "application/json",
    "grant_type": "client_credentials",
    "client_id": "srmu49x5q1w2vjey9suef64w",
    "client_secret": "cHzMmRbi8fn3NiAWiixZQhol",
    "account_id": "110006474"
  })
    .then(tokenResponse => {
      // console.log(tokenResponse)
      request_token.access_token = tokenResponse.data.access_token;
      request_token.rest_instance_url = tokenResponse.data.rest_instance_url;

      axios.post("https://api.twilio.com/2010-04-01/Accounts/" + accountId + "/Messages.json", qs.stringify({
        'Body': req.body.inArguments[0].Message,
        'From': 'whatsapp:+'+req.body.inArguments[0].Sender,
        'To': 'whatsapp:+'+req.body.inArguments[0].PhoneNumber,
      }), {
        auth: {
          username: accountId,
          password: authToken
        }
      })
        .then(twilioResponse => {
          //Send Status to Data Extension for Updates
          // console.log("Response Data" + util.inspect(twilioResponse.data));

          var payload = {
            "items": [{
              "sid": twilioResponse.data.sid,
              "date_created": twilioResponse.data.date_created,
              "date_updated": twilioResponse.data.date_updated,
              "date_sent": twilioResponse.data.date_sent,
              "account_sid": twilioResponse.data.account_sid,
              "to": twilioResponse.data.to,
              "from": twilioResponse.data.from,
              "messaging_service_sid": twilioResponse.data.messaging_service_sid,
              "body": twilioResponse.data.body,
              "status": twilioResponse.data.status,
              "num_segments": twilioResponse.data.num_segments,
              "num_media": twilioResponse.data.num_media,
              "direction": twilioResponse.data.direction,
              "api_version": twilioResponse.data.api_version,
              "price": twilioResponse.data.price,
              "price_unit": twilioResponse.data.price_unit,
              "error_code": twilioResponse.data.error_code,
              "error_message": twilioResponse.data.error_message,
              "uri": twilioResponse.data.uri,
              "subresource_uris": JSON.stringify(twilioResponse.data.subresource_uris)
            }]
          }
          // Axios to Data Extension
          var config = {
            'headers': {
              'Authorization': 'Bearer ' + request_token.access_token
            }
          }
          // console.log(config)
          axios.post(`${request_token.rest_instance_url}data/v1/async/dataextensions/key:${req.body.inArguments[0].DataExtensionResponse}/rows`, payload, config)
            .then(response => {
              // console.log(response);
            })
            .catch(error => {
              console.log("Error DE => "+error);
              res.status(400).send("Data Extension Error");
            })
        })
        .catch(error => {
          console.log('Auth ' + authToken + ' Account SID ' + accountId);
          res.status(400).send("Twilio Error");
          // console.log("Error TWILIO =>" + error);
        })
    })
    .catch(error => {
      // console.log("Error TOKEN => " + error)
      res.status(400).send("Token Error");
    });

  // console.log("ISI SENDER =>" + req.body.inArguments[0].Sender);
  // console.log("ISI PHONE NUMBER => " + req.body.inArguments[0].Mobile);
  // console.log("ISI MESSAGE =>" + req.body.inArguments[0].Message);
  
  logData(req);
  console.log("=======================");
  console.log("EXECUTE FUNCTION STOP");
  res.status(200).send("Execute");
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  // console.log( req.body );
  logData(req);
  res.status(200).send("Publish");
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
  // Data from the req and put it in an array accessible to the main app.
  // console.log( req.body );
  logData(req);
  res.status(200).send("Validate");
};
