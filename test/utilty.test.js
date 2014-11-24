require('should');
var util = require('../lib/utility');

describe('utility', function () {

    describe('#createNonce()', function () {
        it('should return a nonce', function () {
            util.createNonce(32).length.should.be.equal((32+1)*2);
        })
    });

    describe('#createSHA1Hash()', function () {
        it('should a digest', function () {
            var digest = util.createSHA1Hash('message').toString('hex');
            digest.should.be.equal('6f9b9af3cd6e8b8a73c2cdced37fe9f59226e27d');
            digest = util.createSHA1Hash(['first', 'second', 'third']).toString('hex');
            digest.should.be.equal('ba8d9a43f818557b6f52e269b44c402f16d7b226');
        })
    });

    describe('#modPow()', function () {
        it('should calculate pow(x, e) mod m', function () {
            var x = 3;
            var e = 4;
            var m = 10;
            var result = util.modPow(x, e, m).toString('hex');
            result.should.be.equal('01')
        })
    });

});