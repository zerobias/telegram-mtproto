require('requirish')._(module);
require('should');
var SequenceNumber = require('lib/sequence-number');

describe('SequenceNumber', function () {

    describe('#generate()', function () {
        it('should be generate a sequence number', function () {
            var seqNo = new SequenceNumber();
            seqNo.generate(true).should.be.equal(1);
            seqNo.generate(true).should.be.equal(3);
            seqNo.generate(false).should.be.equal(4);
            seqNo.generate(true).should.be.equal(5);
            seqNo.generate(false).should.be.equal(6);
        })
    });
});