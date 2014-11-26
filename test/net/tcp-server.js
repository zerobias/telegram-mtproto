var net = require('net');
var server, port;
server = net.createServer(function (conn) {
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
port = 2001;
server.listen(port, function () {
    console.log("Server bound on port %s\n", port);
})

exports.port = port;