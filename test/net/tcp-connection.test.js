require('requirish')._(module);
require('should');
var TcpConnection = require("lib/net").TcpConnection;

describe('TcpConnection', function () {

    var tcpConn, port;

    before(function () {
        port = require('./tcp-server').start();
    });

    describe('#init()', function () {
        it('should return an instance', function (done) {
            tcpConn = new TcpConnection();
            tcpConn.should.be.ok;
            tcpConn.should.be.a.Object;
            tcpConn.options.should.have.properties({host: "localhost", port: "80"});
            done();
        })
    });

    describe('#connect()', function () {
        it('should notify error back trying connection', function (done) {
            tcpConn = new TcpConnection({host: "nohost"});
            tcpConn.connect(function (e) {
                console.log(e);
                done();
            });
        });
    });

    describe('#write()', function () {
        it('should notify error back on writing', function (done) {
            tcpConn = new TcpConnection({host: "nohost"});
            tcpConn.connect();
            tcpConn.write("a string", function (e) {
                console.log(e);
                done();
            });
        })
    });

    describe('#read()', function () {
        it('should notify error back on reading', function (done) {
            tcpConn = new TcpConnection({host: "nohost"});
            tcpConn.connect();
            tcpConn.read(function (e) {
                console.log(e);
                done();
            });
        })
    });

    describe('#close()', function () {
        it('should notify error back trying disconnection', function (done) {
            tcpConn = new TcpConnection({host: "nohost"});
            tcpConn.connect();
            tcpConn.close(function (e) {
                console.log(e);
                done();
            });
        })
    });

    describe('#init(host, port)', function () {
        it('should return an instance with given host and port', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.options.should.have.properties({host: "0.0.0.0", port: port});
            done();
        })
    });

    describe('#connect()', function () {
        it('should call back after connection', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.connect(function () {
                tcpConn.close();
                done();
            });
        })
    });

    describe('#close()', function () {
        it('should call back after disconnection', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.connect(function () {
                tcpConn.close(done);
            })
        })
    });

    describe('#write()', function () {
        it('should call back after write', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.connect();
            tcpConn.write(new Buffer(">string<"), function () {
                tcpConn.close();
                done();
            });
        })
    });

    describe('#write()', function () {
        it('should notify error back writing data with length not multiple of 4', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.connect(function () {
                tcpConn.write("1234567890", function (e) {
                    console.log(e);
                    tcpConn.close();
                    done();
                });
            });
        })
    });

    describe('#read()', function () {
        it('should call back after read', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.connect();
            tcpConn.write(new Buffer(">string<"));
            tcpConn.read(function (ex, data) {
                data.should.be.a.Buffer;
                console.log(data);
                console.log(data.toString());
                tcpConn.close();
                done();
            });
        })
    });

    describe('#write()', function () {
        it('should call back after write', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.connect();
            var buffer = new Buffer(600);
            tcpConn.write(buffer, function () {
                tcpConn.close();
                done();
            });
        })
    });
    describe('#read()', function () {
        it('should call back after read', function (done) {
            tcpConn = new TcpConnection({host: "0.0.0.0", port: port});
            tcpConn.connect();
            var buffer = new Buffer(600);
            tcpConn.write(buffer);
            tcpConn.read(function (ex, data) {
                data.should.be.a.Buffer;
                data.length.should.equal(600);
                tcpConn.close();
                done();
            });
        })
    });

    after(function () {
        require('./tcp-server').shutdown();
    });

});
