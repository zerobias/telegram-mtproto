require('requirish')._(module);
require('should');
var utility = require('lib/utility');

describe('utility', function () {

    describe('#createNonce()', function () {
        it('should return a nonce', function () {
            utility.createNonce(32).length.should.be.equal((32 + 1) * 2);
        })
    });

    describe('#createSHA1Hash()', function () {
        it('should a digest', function () {
            var digest = utility.createSHAHash('message').toString('hex');
            digest.should.be.equal('6f9b9af3cd6e8b8a73c2cdced37fe9f59226e27d');
            digest = utility.createSHAHash(['first', 'second', 'third']).toString('hex');
            digest.should.be.equal('ba8d9a43f818557b6f52e269b44c402f16d7b226');
        })
    });

    describe('#modPow()', function () {
        it('should calculate pow(x, e) mod m', function () {
            var x = 3;
            var e = 4;
            var m = 10;
            var result = utility.modPow(x, e, m).toString('hex');
            result.should.be.equal('01');
        })
    });

    describe('#xor()', function () {
        it('should calculate xor op between two buffer', function () {
            var buffer1 = new Buffer('0505', 'hex');
            var buffer2 = new Buffer('0b0b', 'hex');
            var buffer = utility.xor(buffer1, buffer2);
            buffer.toString('hex').should.be.equal('0e0e');
        })
    });

    describe('#string2Buffer()', function () {
        it('should convert a String to a buffer', function () {
            var str = '0x0e0e';
            utility.string2Buffer(str, 4).toString('hex').should.be.equal('0e0e0000');
        })
    });

    describe('#buffer2String()', function () {
        it('should convert a Buffer to a String', function () {
            var buffer = new Buffer('0e0e0000', 'hex');
            utility.buffer2String(buffer).should.be.equal('0x00000e0e');
        })
    });

});