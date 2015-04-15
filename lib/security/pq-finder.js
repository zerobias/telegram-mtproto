//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     PQFinder class
//
// This class find the `PQ pair with P < Q` starting from a `BigInteger` value

/*jshint bitwise:false*/

// Import dependencies
var BigInteger = require('bigint-node');

// The constructor may be called either giving a `Buffer` with the binary image or
// a `String / Number` representation of the `BigInteger` number
function PQFinder(pqNumber) {
    this._pqNumber = ('number' === typeof pqNumber) ? createBigIntFromNumber(pqNumber) :
        ('string' === typeof pqNumber) ? createBigIntFromString(pqNumber) : createBigIntFromBuffer(pqNumber);
}

// Get the original PQ pair number.
PQFinder.prototype.getPQPairNumber = function () {
    return this._pqNumber;
};

// The method calculates the pair P and Q with p < q and returns an array where `p = [0] and q = [1]`
PQFinder.prototype.findPQ = function () {
    if (!this._pq) {
        var num = this._pqNumber;
        var prime;
        for (var i = 0; i < 3; i++) {
            var q = createBigIntFromNumber((nextRandom(128) & 15) + 17);
            var x = createBigIntFromNumber(nextRandom(1000000000) + 1);
            var y = x.duplicate();
            var lim = 1 << (i + 18);
            for (var j = 1; j < lim; j++) {
                var a = x.duplicate();
                var b = x.duplicate();
                var c = q.duplicate();
                while (!b.eql(BigInteger.Zero())) {
                    if (b.repr[0] & 1) {
                        c.addEquals(a);
                        if (c.gt(num)) {
                            c = c.subtract(num);
                        }
                    }
                    a.addEquals(a);
                    if (a.gt(num)) {
                        a = a.subtract(num);
                    }
                    b = b.shiftRight(1);
                }
                x = c.duplicate();
                var z = y.gt(x) ? y.subtract(x) : x.subtract(y);
                prime = z.gcd(num, a, b);
                if (!prime.eql(BigInteger.One())) {
                    break;
                }
                if ((j & (j - 1)) === 0) {
                    y = x.duplicate();
                }
            }
            if (prime.gt(BigInteger.One())) {
                break;
            }
        }
        var cofactor = num.divide(prime)[0];
        this._pq = cofactor.gt(prime) ? [prime, cofactor] : [cofactor, prime];
    }
    return this._pq;
};


// the method returns a new Buffer for each P and Q value as array
PQFinder.prototype.getPQAsBuffer = function () {
    return [new Buffer(this.findPQ()[0].toRawBytes()), new Buffer(this.findPQ()[1].toRawBytes())];
};

function createBigIntFromNumber(num) {
    return new BigInteger.FromNumber(num);
}

function createBigIntFromString(num) {
    return new BigInteger.ParseFromString(num, 10);
}

function createBigIntFromBuffer(num) {
    return new BigInteger.FromRawBytes(num);
}

function nextRandom(max) {
    return Math.floor(Math.random() * max);
}

// Export the class
module.exports = exports = PQFinder;
