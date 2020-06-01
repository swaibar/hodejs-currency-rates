/* 
Write a one-page app
	language of your choice (node.js)
	uses https://exchangeratesapi.io/ (Foreign Exchange Rates API)

allows the user to:
    Check current rate of every given currency against any other currency of the user’s choice
    Visualise the historical change in rate between any two dates of the user’s choice, against any currency of the user’s choice
    Calculate retrospective purchasing outcomes, for example:
        If I had purchased £200 worth of CAD in September 2008, how much CAD would I have today?
*/

var http = require('http');
var url  = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

var server = http.createServer((incomingMessage,serverResponse) => {

    var parsedUrl = url.parse(incomingMessage.url,true);

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    incomingMessage.on('data', function(data){
        buffer += decoder.write(data);
    });
    incomingMessage.on('end',function(){
        buffer += decoder.end();

        var data = {
            'trimmedPath'       : parsedUrl.pathname.replace(/^\/+|\/+$/g,''),
            'queryStringObject' : parsedUrl.query,
            'method'            : incomingMessage.method.toLowerCase(),
            'headers'           : incomingMessage.headers,
            'payload'           : buffer
        };

        var chosenHandler = typeof(router[data.trimmedPath]) != 'undefined' ? router[data.trimmedPath] : routes.notFound;
    
        chosenHandler(data,(statusCode,payload) => {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload    = typeof(payload) == 'object'    ? payload    : {};
            var payloadString = JSON.stringify(payload);

            console.log('Returning response:',statusCode,payloadString);

            serverResponse.writeHead(statusCode);
            serverResponse.end(payloadString);
        });
    });
});

var routes = {};
routes.currencies = (data,callback) => {
    callback(418, {'currency page' : 'TODO currency content'});
}

routes.notFound = (data,callback) => {
    callback(404);
}

var router = {
    'currencies' : routes.currencies
}


server.listen(config.httpPort,()=>{
    console.log("The server listens on port "+config.httpPort);
})