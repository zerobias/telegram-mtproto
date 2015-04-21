require('requirish')._(module);
require('should');
var tl = require('telegram-tl-node');
var PlainMessage = require('lib/mtproto').message.PlainMessage;

describe('PlainMessage', function () {

    describe('#init()', function () {
        it('should return an instance', function (done) {

            var msg = new PlainMessage();
            msg.should.be.ok;
            msg.should.be.an.instanceof(PlainMessage);
            msg.should.be.an.instanceof(tl.TypeObject);
            msg.isReadonly().should.be.false;

            msg = new PlainMessage({message: new Buffer('FFFF', 'hex')});
            msg.should.have.properties({auth_key_id: 0, bytes: 2});
            msg.body.toString('hex').should.equal('ffff');

            msg = new PlainMessage({buffer: new Buffer('FFFF', 'hex')});
            msg.retrieveBuffer().toString('hex').should.equal('ffff');

            done();
        })
    });

    var Body = new tl.TypeBuilder.buildType('namespace', {
        "id": "66665",
        "predicate": "body",
        "params": [
            {
                "name": "key",
                "type": "int"
            }
        ],
        "type": "Body"
    });


    describe('#serialize()', function () {
        it('should serialize the msg', function (done) {
            var msg = new PlainMessage({
                message: new Body({
                    props: {
                        key: 6666
                    }
                })
            });
            msg.msg_id = 1;
            var buffer = msg.serialize();
            buffer.should.be.ok;
            buffer.toString('hex').should.be.equal('0000000000000000010000000000000008000000690401000a1a0000');
            done();
        })
    });

    describe('#deserialize()', function () {
        it('should de-serialize the msg', function (done) {
            var msg = new PlainMessage({buffer: new Buffer('0000000000000000010000000000000008000000690401000a1a0000', 'hex')});
            msg.deserialize().should.be.ok;
            msg.msg_id.should.be.equal('0x0000000000000001');
            msg.bytes.should.be.equal(8);
            msg.body.should.be.an.instanceof(Body);
            msg.body.key.should.be.equal(6666);
            done();
        })
    });
});