require('requirish')._(module);
require('should');
var PQFinder = require("lib/security").PQFinder;

describe('PQFinder', function () {

    describe('#init()', function () {
        it('should create a PQFinder instance giving a number', function (done) {
            var pqFinder = new PQFinder(100);
            pqFinder.should.be.ok;
            (pqFinder._pqNumber.equalsNum(100)).should.be.true;
            done();
        })
    });

    describe('#init()', function () {
        it('should create a PQFinder instance giving a String', function (done) {
            var pqFinder = new PQFinder('123456789');
            pqFinder.should.be.ok;
            (pqFinder._pqNumber.equalsNum(123456789)).should.be.true;
            done();
        })
    });

    describe('#init()', function () {
        it('should create a PQFinder instance giving a Buffer', function (done) {
            var pqFinder = new PQFinder(new Buffer('075BCD15', 'hex'));
            pqFinder.should.be.ok;
            (pqFinder._pqNumber.equalsNum(123456789)).should.be.true;
            done();
        })
    });

    describe('#findPQ()', function () {
        it('should find P and Q returning as [p, q]', function (done) {

            var pqFinder = new PQFinder(new Buffer('17ED48941A08F981', 'hex'));
            console.log(pqFinder._pqNumber.toStr(10));
            console.log(pqFinder.findPQ()[0].toStr(16));
            console.log(pqFinder.findPQ()[1].toStr(16));
            console.log(pqFinder.getPQAsBuffer());
            (pqFinder.findPQ()[0].equalsNum(1229739323)).should.be.true;
            (pqFinder.findPQ()[1].equalsNum(1402015859)).should.be.true;

            done();
        })
    });

});

