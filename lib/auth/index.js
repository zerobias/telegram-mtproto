//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export the classes
exports.AuthKey = require('./auth-key');
exports.RequestPQ = require('./request-pq');
exports.RequestDHParams = require('./request-dh-params');
exports.SetClientDHParams = require('./set-client-dh-params');
exports.createAuthKey = createAuthKey;

// Import dependencies
var flow = require('get-flow');

// Create the authorization key
function createAuthKey(callback, channel) {

    flow.retryUntilIsDone(callback, null,
        function (callback) {
            flow.runSeries([
                require('./request-pq'),
                require('./request-dh-params'),
                require('./set-client-dh-params')
            ], callback, channel);
        });
}
