require('should');
var net = require('net');
var mtproto = require('lib/mtproto');
var TcpConnection = require("lib/net").TcpConnection;
var TypeObject = require('telegram-tl-node').TypeObject;
var TypeVector = require('telegram-tl-node').TypeVector;

describe('mtproto', function () {

    var tcpConn, server, port;
    before(function () {
        server = net.createServer(function (conn) {
            console.log('Server: connected');
            conn.on('data', function (data) {

                if (data.length == 1 && data[0] == 0xef) {
                    console.log('Server: abridgedFlag detected');
                } else {
                    if(data[0] == 0xef) {
                        data = data.slice(1);
                    }
                    console.log('Server: received data of length %s: %s', data.length, data.toString('hex'));
                    var requestBuffer = new TcpConnection.Message({buffer: data}).deserialize().getMessage();
                    console.log('tcpMessage %s', requestBuffer.toString('hex'));
                    var requestBuffer = new mtproto.PlainMessage({buffer: requestBuffer}).deserialize().getMessage();
                    console.log('plainMessage %s', requestBuffer.toString('hex'));
                    var reqPQ = new mtproto.req_pq.PayloadType({buffer: requestBuffer}).deserialize();
//                    console.log(reqPQ);
                    var resPQ = new mtproto.ResPQ({props: {
                        nonce: reqPQ.nonce,
                        server_nonce: '0x30739073a54aba77a81ea1f4334dcfa5',
                        pq: new Buffer('17ed48941a08f981', 'hex'),
                        server_public_key_fingerprints: new TypeVector({type: 'long', list: ['0xc3b42b026ce86b21']})
                    }});
                    var resPQBuffer = resPQ.serialize();
                    console.log('Server: Send resPQ  %s', resPQBuffer.toString('hex'));
                    var plainMsg = new mtproto.PlainMessage({message: resPQBuffer});
                    var plainMsgBuffer = plainMsg.serialize();
                    var tcpMsg = new TcpConnection.Message({message: plainMsgBuffer});
                    var tcpMsgBuffer = tcpMsg.serialize();
                    conn.write(tcpMsgBuffer);
                }
            })
        });
        port = 2001;
        server.listen(port, function () {
            console.log('Server bound on port %s\n', port);
            tcpConn = new TcpConnection({host: '0.0.0.0', port: port});
        })
    });

    describe('#method reqPQ', function () {
        it('should works', function (done) {
            var nonce = '0xf67b7768bf4854bb15fa840ec843875f';
            mtproto.req_pq({
                props: {
                    nonce: nonce
                },
                conn: tcpConn,
                callback: function (ex, resPQ) {
                    if(ex) console.warn(ex);
                    resPQ.nonce.should.be.eql(nonce);
                    done();
                }
            })
        })
    });

/*
    describe('#class building', function () {
        it('should build all requested classes', function (done) {
            for (var i = 0; i < mtproto._classes.length; i++) {
                var className = mtproto._classes[i];
                var obj = new mtproto[className]();
                obj.should.be.ok;
                obj.should.be.an.instanceof(TypeObject);
            }
            done();
        })
    });
*/

    describe('PlainMessage', function () {

        describe('#init()', function () {
            it('should return an instance', function (done) {

                var msg = new mtproto.PlainMessage();
                msg.should.be.ok;
                msg.should.be.an.instanceof(mtproto.PlainMessage);
                msg.should.be.an.instanceof(TypeObject);
                msg.isReadonly().should.be.false;

                msg = new mtproto.PlainMessage({message: new Buffer('FFFF', 'hex')});
                msg.should.have.properties({_authKeyId: 0, _messageLength: 2});
                msg.getMessage().toString('hex').should.equal('ffff');

                msg = new mtproto.PlainMessage({buffer: new Buffer('FFFF', 'hex')});
                msg.retrieveBuffer().toString('hex').should.equal('ffff');

                done();
            })
        });

        describe('#serialize()', function () {
            it('should serialize the msg', function (done) {
                var msg = new mtproto.PlainMessage({message: new Buffer('FFFF', 'hex')});
                msg._messageId = 1;
                var buffer = msg.serialize();
                buffer.should.be.ok;
                buffer.toString('hex').should.be.equal('0000000000000000010000000000000002000000ffff');
                done();
            })
        });

        describe('#deserialize()', function () {
            it('should de-serialize the msg', function (done) {
                var msg = new mtproto.PlainMessage({buffer: new Buffer('0000000000000000010000000000000002000000ffff', 'hex')});
                msg.deserialize().should.be.ok;
                msg.getMessageId().should.be.equal('0x0000000000000001');
                msg.getMessage().toString('hex').should.equal('ffff');
                done();
            })
        });
    });

    after(function () {
        tcpConn.close();
        server.close();
    });
});
