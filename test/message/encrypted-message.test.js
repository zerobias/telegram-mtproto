require('requirish')._(module);
require('should');
var tl = require('telegram-tl-node');
var mtproto = require('lib/mtproto').type;
var EncryptedMessage = require('lib/message/encrypted-message');

describe('EncryptedMessage', function() {

    describe('InnerMessage', function() {

        var innerModel = {
            props: {
                server_salt: '0xfce2ec8fa401b366',
                session_id: '0x77907373a54aba77',
                payload: new mtproto.Message({
                    props: {
                        msg_id: '0x84739073a54aba84',
                        seqno: 0,
                        bytes: 2,
                        body: new Buffer('FFFF', 'hex')
                    }
                })
            }
        };

        describe('#init()', function() {
            it('should return an instance', function(done) {
                var msg = new EncryptedMessage.InnerMessage();
                msg.should.be.ok;
                msg.should.be.an.instanceof(EncryptedMessage.InnerMessage);
                msg.should.be.an.instanceof(tl.TypeObject);
                msg.isReadonly().should.be.false;

                msg = new EncryptedMessage.InnerMessage(innerModel);
                msg.should.be.an.instanceof(EncryptedMessage.InnerMessage);
                msg.should.have.properties({
                    server_salt: '0xfce2ec8fa401b366',
                    session_id: '0x77907373a54aba77'
                });
                msg.payload.should.be.an.instanceof(mtproto.Message);
                msg.payload.bytes.should.be.equal(2);
                msg.payload.body.toString('hex').should.equal('ffff');
                done();
            })
        });

        describe('#serialize()', function() {
            it('should serialize the msg', function(done) {
                var msg = new EncryptedMessage.InnerMessage(innerModel);
                var buffer = msg.serialize();
                buffer.should.be.ok;
                buffer.toString('hex').should.be.equal('66b301a48fece2fc77ba4aa57373907711e5b85b84ba4aa5739073840000000002000000ffff');
                done();
            })
        });

        describe('#deserialize()', function() {
            it('should de-serialize the msg', function(done) {
                var msg = new EncryptedMessage.InnerMessage({
                    buffer: new Buffer('66b301a48fece2fc77ba4aa57373907711e5b85b84ba4aa5739073840000000002000000ffff', 'hex')
                });
                msg.deserialize().should.be.ok;
                msg.should.be.an.instanceof(EncryptedMessage.InnerMessage);
                msg.should.have.properties({
                    server_salt: '0xfce2ec8fa401b366',
                    session_id: '0x77907373a54aba77'
                });
                msg.payload.should.be.an.instanceof(mtproto.Message);
                msg.payload.bytes.should.be.equal(2);
                msg.payload.body.toString('hex').should.equal('ffff');
                done();
            })
        });
    });

});