require('should');
var time = require('../lib/time');

describe('time', function () {

    describe('#getLocalTime()', function () {
        it('should be a synchronized time', function () {
            var offset = 1000;
            var duration = 200;
            var localTime = new Date().getTime();
            var serverTime = localTime + offset;
            time.timeSynchronization(serverTime, duration);
            time.getLocalTime().should.be.approximately(localTime + (offset + duration/2), 50);
        })
    });
});