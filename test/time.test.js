require('requirish')._(module);
require('should');
var time = require('lib/time');

describe('time', function () {

    describe('#getLocalTime()', function () {
        it('should be a synchronized time', function () {
            var offset = .05;
            var duration = 100;
            var localTime = new Date().getTime();
            var serverTime = Math.round(localTime / 1000) + offset;
            time.timeSynchronization(serverTime, duration);
            var check = localTime + (offset * 1000 + duration / 2);
            var synchLocalTime = time.getLocalTime();
            console.log('synchLocalTime %s should be more or less %s', synchLocalTime, check);
            synchLocalTime.should.be.approximately(check, 1000);

            duration = 700;
            time.timeSynchronization(serverTime, duration);
            var synchLocalTime2 = time.getLocalTime();
            synchLocalTime2.should.be.approximately(synchLocalTime, 50);
        })
    });
});