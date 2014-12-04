require('should');
var TypeObject = require('telegram-tl-node').TypeObject;
var PlainMessage = require('../../lib/mtproto').message.PlainMessage;

describe('PlainMessage', function () {

    describe('#init()', function () {
        it('should return an instance', function (done) {

            var msg = new PlainMessage();
            msg.should.be.ok;
            msg.should.be.an.instanceof(PlainMessage);
            msg.should.be.an.instanceof(TypeObject);
            msg.isReadonly().should.be.false;

            msg = new PlainMessage({message: new Buffer('FFFF', 'hex')});
            msg.should.have.properties({_authKeyId: 0, _messageLength: 2});
            msg.getMessage().toString('hex').should.equal('ffff');

            msg = new PlainMessage({buffer: new Buffer('FFFF', 'hex')});
            msg.retrieveBuffer().toString('hex').should.equal('ffff');

            done();
        })
    });

    describe('#serialize()', function () {
        it('should serialize the msg', function (done) {
            var msg = new PlainMessage({message: new Buffer('FFFF', 'hex')});
            msg._messageId = 1;
            var buffer = msg.serialize();
            buffer.should.be.ok;
            buffer.toString('hex').should.be.equal('0000000000000000010000000000000002000000ffff');
            done();
        })
    });

    describe('#deserialize()', function () {
        it('should de-serialize the msg', function (done) {
            var msg = new PlainMessage({buffer: new Buffer('0000000000000000010000000000000002000000ffff', 'hex')});
            msg.deserialize().should.be.ok;
            msg.getMessageId().should.be.equal('0x0000000000000001');
            msg.getMessage().toString('hex').should.equal('ffff');
            done();
        })
    });
});