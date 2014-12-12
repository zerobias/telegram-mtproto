require('requirish')._(module);
require('should');
var HttpConnection = require('lib/net').HttpConnection;

var isNode = (typeof window === 'undefined');

describe('HttpConnection', function () {

    var conn, protocol, hostname, port;

    this.timeout(30000);

    before(function () {
        protocol = isNode ? undefined : 'https';
        hostname = isNode ? 'localhost' : window.location.hostname;
        port = isNode ? require('./http-server').port : window.location.port;
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
            conn = new HttpConnection({protocol: protocol, host: "nohost"});
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
            conn = new HttpConnection({protocol: protocol, host: hostname, port: port});
            conn.connect();
            conn.write(new Buffer("test post method"));
            conn.read(function (ex, data) {
                if (ex) {
                    console.err(ex);
                }
                data.should.be.ok;
                console.log(data.toString());
                done();
            });
        })
    });

    after(function () {
        if (isNode) {
            require('./http-server').shutdown();
        } else {
            conn = new HttpConnection({protocol: protocol, host: hostname, port: port});
            conn.connect(function () {
                conn.write(new Buffer("shutdown"));
                conn.read(function (ex, data) {
                });
            });
        }
    });
});
