/* 
Write a one-page app
	language of your choice (JavaScript: node.js and angular and without NPM or PHP)
    uses https://exchangeratesapi.io/ (Foreign Exchange Rates API)
    (added to github https://github.com/swaibar/nodejs-currency-rates/)

allows the user to:
    Check current rate of every given currency against any other currency of the user’s choice
    Visualise the historical change in rate between any two dates of the user’s choice, against any currency of the user’s choice
    Calculate retrospective purchasing outcomes, for example:
        If I had purchased £200 worth of CAD in September 2008, how much CAD would I have today?

Progress:
 * Initally this node.js code was comitted to provide a module free handler for our application
 * Started with a file reader to store the users prefernce and then realised this would need authentication
 * After this commit I started to look at users and authentication, then as this is "needed" I moved on to look at templating
 * While looking at templating I decided to use angular and keep this as pure javascript as possible and as I've already made it clear I can use the package manager... maybe I can complete without?
 * Templating and users were not needed so I returned to focus on the main requirements and started to use angular in a single test html to develop this
 * Despite focus not on presentation I like to use an application that looks appealing so I added basic bootstrap, flags, currency symbol and basic table styling

 Note:
 * The API only goes back to 2000 (start of ECB/EUR?) and cannot get rates in the future update form, maybe using fixer.io better and AFAIK ECB updates the rates daily, this might not be good enough

TODO:
 * improve graph: series colours; title; better axis;
 * If I had purchased £200 worth of CAD in September 2008, how much CAD would I have today?
 * refactor and comment
 * User authentication (sign up, manage profile, login, logout, etc) to store their base currency
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