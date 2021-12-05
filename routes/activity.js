'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const axios = require('axios');
const qs = require('qs');
var http = require('https');
var request = require('request');
const { response } = require('express');

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
    // require('dotenv').config();
    
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const accountId = process.env.TWILIO_ACCOUNT_SID
    const mcToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjQiLCJ2ZXIiOiIxIiwidHlwIjoiSldUIn0.eyJhY2Nlc3NfdG9rZW4iOiJZNVYxWXJ3NnYzbWtBaTh4eTc0WTNhWUIiLCJjbGllbnRfaWQiOiJzcm11NDl4NXExdzJ2amV5OXN1ZWY2NHciLCJlaWQiOjExMDAwNjQ3NCwic3RhY2tfa2V5IjoiUzExIiwicGxhdGZvcm1fdmVyc2lvbiI6MiwiY2xpZW50X3R5cGUiOiJTZXJ2ZXJUb1NlcnZlciJ9.gnmpwr17TIfIcCJVFuu1gwmrvWZipe_jgkfj_8us3tM.umIJrT07Ve6EyZyixeTdI1hPeX13-JlvguU8Lc5QUYdvaRusktM6tZSSpGRlRdORNQxu1PfercHJmSpX_icgNHgVM1zIMZGEFcPo5VQ0CT0Sq_jC4nyPkbta4vip4rZtcnDsUBF3yAR76b809chtlZDtRVMvXlH7haKgbk6Z2jIMe3PjR7k"
    const dataextensionId = "F8BCBDCC-6526-49BD-BCBE-CC4A906FE0D2"

    var response = {
        "data":
            {
                "items": [{
                    'sid': 'SM90a4ab1874da40879dee0b5f16c16dc',
                    'date_created': 'Sat, 04 Dec 2021 07:06:29 +0000',
                    'date_updated': 'Sat, 04 Dec 2021 07:06:29 +0000',
                    'date_sent': null,
                    'account_sid': 'ACb494ea5723f3f2f591bbc092b094d41d',
                    'to': 'whatsapp:+6285719752942',
                    'from': 'whatsapp:+14155238886',
                    'messaging_service_sid': null,
                    'body': 'Ini test message dari custom journey builider version 4',
                    'status': 'queued',
                    'num_segments': '1',
                    'num_media': '0',
                    'direction': 'outbound-api',
                    'api_version': '2010-04-01',
                    'price': null,
                    'price_unit': null,
                    'error_code': null,
                    'error_message': null,
                    'uri': '/2010-04-01/Accounts/ACb494ea5723f3f2f591bbc092b094d41d/Messages/SM90a4ab1874da40879dee0b5f16c16dc2.json',
                    'subresource_uris': "{ media: '/2010-04-01/Accounts/ACb494ea5723f3f2f591bbc092b094d41d/Messages/SM90a4ab1874da40879dee0b5f16c16dc2/Media.json' } }"
                }]
            }

    }

    var config = {
        'headers': {
            'Authorization': 'Bearer '+mcToken
        }
    }

    var data = {
        'items': [response.data]
    }
    
    axios.post(`https://mcx3dk6gqx05byn626r3yqc9-hl0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:${dataextensionId}/rows`, data, config)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    })

    // axios.post("https://api.twilio.com/2010-04-01/Accounts/"+accountId+"/Messages.json", qs.stringify({
    //     'Body': req.body.inArguments[0].Message,
    //     'From': 'whatsapp:+'+ req.body.inArguments[0].Sender,
    //     'To': 'whatsapp:+'+ req.body.inArguments[0].Mobile,
    // }), {
    //   auth: {
    //     username: accountId,
    //     password: authToken
    //   }
    // })
    // .then(response => {
    //     //Send Status to Data Extension for Updates
    //     console.log("Response Data"+util.inspect(response.data));

    //     // Axios to Data Extension
    // })
    // .catch(error => {
    //   console.log('Auth '+authToken+' Account SID '+accountId);
    //   console.log(error);
    // }) 

    console.log('ISI DATA EXTENSION =>'+req.body.inArguments[0].DataExtension);
    console.log('ISI SENDER =>'+req.body.inArguments[0].Sender);
    console.log('ISI PHONE NUMBER => '+req.body.inArguments[0].Mobile);
    console.log('ISI MESSAGE =>'+req.body.inArguments[0].Message)
    // console.log(req.body)
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