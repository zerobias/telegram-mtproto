var http = require('http');
var server;
server = http.createServer(function (req, res) {
    console.log('Server: requested URL %s', req.url);
    console.log('Server: requested header %s', JSON.stringify(req.headers));
    console.log('Server: requested method %s', JSON.stringify(req.method));

    if (req.method == 'POST') {
        console.log('POST method');
        req.setEncoding('utf8');
        req.on('data', function (chunk) {
            console.log('data: %s', chunk);
            if ('shutdown' == chunk) {
                exports.shutdown();
            }
            res.end('OK');
        });

    } else {
        console.log('GET method');
        res.end('OK');
    }
});

exports.port = function () {
    var port = process.env.ZUUL_PORT || 2001;
    server.listen(port, function () {
        console.log("HTTP Server bound on port %s\n", port);
    });
    return port;
}();

exports.shutdown = function () {
    server.close();
    console.log('HTTP Server shutdown.')
};