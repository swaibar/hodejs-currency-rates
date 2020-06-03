/* 
A simple node server setup to allow for simple routing cases
which at present is used to serve a single page on http://localhost:3000/currencies
*/

var http = require('http');
var url  = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

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
            'payload'           : buffer
        };

        //implment very simple routing
        var chosenHandler = typeof(router[data.trimmedPath]) != 'undefined' ? router[data.trimmedPath] : routes.notFound;
        chosenHandler(data,(statusCode,payload) => {

            //return response
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload    = typeof(payload) == 'string'    ? payload    : '';

            serverResponse.writeHead(statusCode,{'Content-Type': 'text/html'});
            serverResponse.write(payload);
            serverResponse.end();
        });
    });
});

//Simple router
//one route for our one page app, a 404 and and array register
var routes = {};
routes.currencies = (data,callback) => {
    var fs = require('fs');
    fs.readFile("currency-one-page-app.html", function(err,data)
    {
        if(err) {
            console.log(err)
        }
        else {
            callback(200, data.toString());
        }
    });
}
routes.notFound = (data,callback) => {
    callback(404,'Not Found');
}

var router = {
   'currencies' : routes.currencies
}

//Start the server listening on the post from config
server.listen(config.httpPort,()=>{
    console.log("The server listens on port "+config.httpPort);
})