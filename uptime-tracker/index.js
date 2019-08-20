const http = require('http');
const url = require('url');

const StringDecoder = require('string_decoder').StringDecoder;

var config = require('./config');


const server = http.createServer(function(req, res){

    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;

    var method = req.method;
    

    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    console.log('Requested Path : ' + trimmedPath);


    var queryStringObject = parsedUrl.query;
    console.log(queryStringObject);


    //Get the Header as Object
    var headers = req.headers;
    console.log(headers);


    // Parsing Payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';

    
    req.on('data', function(data){
        buffer += decoder.write(data);
    });


    req.on('end', function(){
        buffer += decoder.end();

        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notFound;


        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'headers' : headers,
            'method' : method,
            'payload' : buffer
        };

        console.log('Request Recieved : ' + buffer);
    
        // Route the request choosen in this handler 
    
        chosenHandler(data, function(statusCode, payload){
    
            //set the statusCode
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
    
            // CHECKING PAYLOAD
            payload = typeof(payload) == 'object' ? payload : {};
            
            var payloadString = JSON.stringify(payload);
    
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
    
        });
        
       
    });

});

// Defining a Handler
var handler = {};

// Sample Router
handler.sample = function(data, callback){
    callback(406, {name : 'Message from Callback'});
}

// Login Router 
handler.login = function(data, callback){
    callback(406, {name : 'Login Requested'});
}

// Not Found Router

handler.notFound = function(data, callback){
    callback(404);
}

// Defining a Router
var router = {
    'sample' : handler.sample,
    'login' : handler.login
};

server.listen(config.port, function(){
    console.log('Server Started on PORT '+ config.port);
});