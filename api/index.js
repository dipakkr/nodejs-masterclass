const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer(function(req, res){
    
    const path = req.url;
    const method = req.method;
    const headers = req.headers;

    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    var decoder = new StringDecoder('utf-8');
    var buffer = '';


    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    
    req.on('end', function(){
        buffer += decoder.end();

        var data = {
            'trimmedPath' : trimmedPath,
            'headers' : headers,
            'method' : method,
            'payload' : buffer
        };
    
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound;
        
        chosenHandler(data, function(statusCode, payload){
        
            payload  = typeof(payload) == 'object' ? payload : {} ;

            var payloadString = JSON.stringify(payload);
            
            res.end(payloadString);

        });
    });  
});

var handler = {};

handler.notFound = function(data, callback){
    callback(404, {message : 'NOT FOUND'});
}

handler.hello = function(data, callback){
    callback(406, {message : 'Hello World'});
}

var router = {
    'hello' : handler.hello
};


server.listen(3000, function(){
    console.log('Server has started on port 3000');
});

