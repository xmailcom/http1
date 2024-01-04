var request = require('request');
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));
app.set('host', (process.env.HOST || '0.0.0.0'));

app.get('/', function(req, res) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.send({'status': 'ok'});
});

app.post('/x', function(req, res) {
    var url = req.body['url'];
    var headers = req.body['headers'];
    var method = req.body['method'];
    var body = req.body['body'];
    console.log(url);
    console.log(headers);
    console.log(method);
    console.log(body);
    request({
        url: url,
        headers: headers,
        method: method,
        body: body,
    }, function(error, response, body) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        res.send({headers: response.headers, body: body});
    });
});

app.listen(app.get('port'), app.get('host'), function() {
    console.log("Node app is running at " + app.get('host') + ":" + app.get('port'));
});
