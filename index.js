var request = require('request');
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));
app.set('host', (process.env.HOST || "0.0.0.0"));

var set_cors_headers = function(req, res) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "86400");
    res.header("Access-Control-Allow-Methods", "OPTIONS, HEAD, GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Access-Control-Allow-Headers, Authorization, Accept, X-Requested-With");
}

var options_handle = function(req, res) {
    set_cors_headers(req, res);
    res.sendStatus(204);
}

app.options('/', function(req, res) {
    options_handle(req, res);
});

app.get('/', function(req, res) {
    set_cors_headers(req, res);
    res.send({'status': 'ok'});
}); 

app.options('/x', function(req, res) {
    options_handle(req, res);
});

app.post('/x', function(req, res) {
    var method = req.body['method'];
    var url = req.body['url'];
    var headers = req.body['headers'];
    var body = req.body['body'];
    console.log('method:', method);
    console.log('url:', url);
    console.log('headers:', headers);
    console.log('body:', body);
    request({
        url: url,
        headers: headers,
        method: method,
        body: body,
    }, function(error, response, body) {
        set_cors_headers(req, res);
        res.send({headers: response.headers, body: body});
    });
});

app.listen(app.get('port'), app.get('host'), function() {
    console.log("Node app is running at " + app.get('host') + ":" + app.get('port'));
});
