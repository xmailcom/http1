var axios = require('axios');
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

app.options('*', function(req, res) {
    set_cors_headers(req, res);
    res.sendStatus(204);
});

app.get('/', function(req, res) {
    set_cors_headers(req, res);
    res.send({'status': 200});
});

app.get('/x', function(req, res) {
    set_cors_headers(req, res);
    res.send({status: 200, message: 'method,url,headers,params,data'});
}); 

app.post('/x', function(req, res) {
    set_cors_headers(req, res);
    var method = req.body['method'];
    var url = req.body['url'];
    var headers = req.body['headers'] || {};
    var params = req.body['params'];
    var data = req.body['data'];
    var b = headers['b'] || '';
    console.log('method:', method);
    console.log('url:', url);
    console.log('headers:', headers);
    console.log('params:', params);
    console.log('data:', data);

    if (b === '1') {
        axios.request({
            method: method,
            url: url,
            headers: headers,
            params: params,
            data: data,
        }).then(function(response) {
            res.set(response.headers);
            set_cors_headers(req, res);
            response.data.pipe(res);
        }).catch(function(error) {
            console.log('error:', error);
            if (error.response) {
                var response = error.response;
                res.send({
                    status: response.status,
                    headers: response.headers,
                    data: response.data
                });
            } else {
                res.send({
                    status: -1
                });
            }
        })
    } else {
        axios.request({
            method: method,
            url: url,
            headers: headers,
            params: params,
            data: data,
            responseType: 'text'
        }).then(function(response) {
            res.send({
                status: response.status, 
                headers: response.headers, 
                data: response.data
            });
        }).catch(function(error) {
            console.log('error:', error);
            if (error.response) {
                var response = error.response;
                res.send({
                    status: response.status,
                    headers: response.headers,
                    data: response.data
                });
            } else {
                res.send({
                    status: -1
                });
            }
        });
    }
});

app.listen(app.get('port'), app.get('host'), function() {
    console.log("Node app is running at " + app.get('host') + ":" + app.get('port'));
});
