
var http = require('http');
var server, port;
server = http.createServer(function (req, res) {

    console.log('Server: requested URL %s', req.url);
    console.log('Server: requested header %s', JSON.stringify(req.headers));
    console.log('Server: requested method %s', JSON.stringify(req.method));
    req.on('data', function(data) {
        console.log('data: %s', data);
    });
//    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200);
    var chunk = '1234567890';
    res.end(chunk);
    console.log('SENT: %s', chunk);
});
port = process.env.ZUUL_PORT || 2001;
server.listen(port, function () {
    console.log("Server bound on port %s\n", port);
});

exports.port = port;