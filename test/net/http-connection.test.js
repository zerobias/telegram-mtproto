require('should');
var http = require('http');
var HttpConnection = require("../../lib/net").HttpConnection;

describe('HttpConnection', function () {

    var conn, server, port;

    before(function () {
        server = http.createServer(function (req, res) {

            console.log('Server: requested URL %s', req.url);
            console.log('Server: requested header %s', JSON.stringify(req.headers));
            console.log('Server: requested method %s', JSON.stringify(req.method));
            req.on('data', function(data) {console.log('data: %s', data); });
            res.writeHead(200);
            res.end('1234567890');

        });
        port = 2001;
        server.listen(port, function () {
            console.log("Server bound on port %s\n", port);
        })

    });

    describe('#init()', function () {
        it('should return an instance', function (done) {
            conn = new HttpConnection();
            conn.should.be.ok;
            conn.should.be.a.Object;
            conn.options.should.have.properties({path: 'http://localhost:80/apiw1'});
            done();
        })
    });


    describe('#read()', function () {
        it('should notify error back on reading', function (done) {
            conn = new HttpConnection({host: "nohost"});
            conn.connect();
            conn.read(function (e) {
                console.log(e);
                done();
            });
        })
    });

    describe('#init(host, port)', function () {
        it('should return an instance with given host and port', function (done) {
            conn = new HttpConnection({host: "0.0.0.0", port: port});
            conn.options.should.have.properties({path: '/apiw1'});
            done();
        })
    });

    describe('#connect()', function () {
        it('should call back after HttpConnection', function (done) {
            conn = new HttpConnection({host: "0.0.0.0", port: port});
            conn.connect(done);
        })
    });

    describe('#write()', function () {
        it('should call back after write', function (done) {
            conn = new HttpConnection({host: "0.0.0.0", port: port});
            conn.connect();
            conn.write(new Buffer(">string<"), done);
        })
    });

    describe('#read()', function () {
        it('should call back after read', function (done) {
            conn = new HttpConnection({host: "0.0.0.0", port: port});
            conn.connect();
            conn.write(new Buffer(">string<"));
            conn.read(function (ex, data) {
                data.should.be.a.Buffer;
                console.log(data);
                console.log(data.toString());
                done();
            });
        })
    });
    describe('#read()', function () {
        it('outgoing connection should call back after read', function (done) {
            conn = new HttpConnection({
                proxyHost: process.env.PROXY_HOST,
                proxyPort: process.env.PROXY_PORT,
                host: "www.google.com",
                port: '80'
            });
            conn.connect();
            conn.read(function (ex, data) {
                if(ex) {
                    console.log("response ko: %s", ex.toString());
                } else {
                    console.log("response OK: %s", data.toString());
                }
                done();
            });
         })
    });

    after(function () {
        server.close();
    });
});
