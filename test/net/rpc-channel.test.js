require('requirish')._(module);
require('should');
var mtproto = require('lib/mtproto');
var net = require("lib/net");
var tl = require('telegram-tl-node');


describe('RpcChannel', function () {

    var tcpConn;
    var port = 3003;
    var ResPQ, resPq;

    before(function () {
        require('./tcp-server').start(port);
        tcpConn = new net.TcpConnection({host: "0.0.0.0", port: port});
        tcpConn.connect();
        ResPQ = new tl.TypeBuilder.buildType('namespace', {
            "id": "85337187", "predicate": "resPQ", "params": [
                {"name": "nonce", "type": "int128"},
                {"name": "server_nonce", "type": "int128"},
                {"name": "pq", "type": "bytes"},
                {"name": "server_public_key_fingerprints", "type": "Vector<long>"}
            ], "type": "ResPQ"
        });

        resPq = new ResPQ({
            props: {
                nonce: '0xfce2ec8fa401b366e927ca8c8249053e',
                server_nonce: '0x30739073a54aba77a81ea1f4334dcfa5',
                pq: new Buffer('17ed48941a08f981', 'hex'),
                server_public_key_fingerprints: new tl.TypeVector({type: 'long', list: ['0xc3b42b026ce86b21']})
            }
        });
    });

    describe('#init()', function () {
        it('should notify error back ', function (done) {
            try {
                new net.RpcChannel();
            } catch (err) {
                done();
            }
        })
    });

    describe('#init()', function () {
        it('should create an instance', function () {
            var rpcChannel = new net.RpcChannel(tcpConn);
            rpcChannel.should.be.ok;
            rpcChannel.isOpen().should.be.true;
        })
    });

    describe('#close()', function () {
        it('should close the channel', function () {
            var rpcChannel = new net.RpcChannel(tcpConn);
            rpcChannel.should.be.ok;
            rpcChannel.close();
            rpcChannel.isOpen().should.be.false;
        })
    });

    describe('#callMethod()', function () {
        it('should call the method', function (done) {
            var rpcChannel = new net.RpcChannel(tcpConn);
            rpcChannel.callMethod(resPq, function (ex, resObj, duration) {

                resObj.should.be.ok;
                resObj.should.have.properties({
                    _typeId: '63241605',
                    _typeName: 'namespace.ResPQ',
                    nonce: '0xfce2ec8fa401b366e927ca8c8249053e',
                    server_nonce: '0x30739073a54aba77a81ea1f4334dcfa5'
                });
                console.log('calling the method takes %sms', duration);
                rpcChannel.close();
                done();
            });
        })
    });

    after(function () {
        tcpConn.close();
        require('./tcp-server').shutdown(port);
    });
});
