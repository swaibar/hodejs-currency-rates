/* 
A simple node server setup to allow for simple routing cases
which at present is used to serve a single page on http://localhost:3000/currencies
*/

var http = require('http');
var url  = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

//Create a server that reads all the incoming data of the request
//implment very simple routing
//return response
var server = http.createServer((incomingMessage,serverResponse) => {

    //Create a server that reads all the incoming data of the request
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
            'payload'           : helpers.parseJsonToObject(buffer)
        };

        console.log(data);

        //implment very simple routing
        var chosenHandler = typeof(router[data.trimmedPath]) != 'undefined' ? router[data.trimmedPath] : handlers.notFound;
        chosenHandler(data,(statusCode,payload) => {

            //return response
            contentType = typeof(payload) == 'string'   ? 'html'     : 'json';
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            var payloadString = '';
            if(contentType == 'json'){
                serverResponse.writeHead(statusCode,{'Content-Type': 'application/json'});
                payloadString = JSON.stringify(payload);
            }
            if(contentType == 'html'){
                serverResponse.writeHead(statusCode,{'Content-Type': 'text/html'});
                payloadString = payload;
            }

            serverResponse.end(payloadString);
        });
    });
});


var router = {
    'users'      : handlers.users,
    'tokens'     : handlers.tokens,
    'currencies' : handlers.currencies
}

//Start the server listening on the post from config
server.listen(config.httpPort,()=>{
    console.log("The server listens on port "+config.httpPort);
})