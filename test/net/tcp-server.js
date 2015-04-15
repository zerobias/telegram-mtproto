var net = require('net');
var servers = {};
var defaultPort = 3002;
exports.start = function (port) {
    port = port || defaultPort;
    key = 'port' + port;
    servers[key] = net.createServer(function (conn) {
        console.log("Server: connected");
        conn.on("data", function (data) {

            if (data.length == 1 && data[0] == 0xef) {
                console.log("Server: abridgedFlag detected");
            } else {
                console.log("Server: echo data of length %s:", data.length);
                console.log(data);
                conn.write(data);
            }
        })
    });

    servers[key].listen(port, function () {
        console.log("TCP Server bound on port %s\n", port);
    });
    return port;
};

exports.shutdown = function (port) {
    port = port || defaultPort;
    key = 'port' + port;
    servers[key].close();
    console.log('TCP Server %s shutdown.', port);
};