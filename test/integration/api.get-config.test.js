require('should');
require('requirish')._(module);
var auth = require('lib/auth');
var mtproto = require('lib/mtproto');
var net = require('lib/net');
var utility = require('lib/utility');
var SequenceNumber = require('lib/sequence-number');
var tl = require('telegram-tl-node');

var primaryDC = {host: "149.154.167.40", port: "80"}; // TEST.DC2
require('lib/security').PublicKey.addKey({
    fingerprint: '0xc3b42b026ce86b21',
    modulus: 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
    exponent: '010001'
});

describe('api', function () {
    this.timeout(60000);
    describe('#call getConfig', function () {
        it('should get the config..', function (done) {

            new tl.TypeBuilder.buildType('api', {
                "id": "-1132882121",
                "predicate": "boolFalse",
                "params": [],
                "type": "Bool"
            });

            new tl.TypeBuilder.buildType('api', {
                "id": "-1720552011",
                "predicate": "boolTrue",
                "params": [],
                "type": "Bool"
            });

            new tl.TypeBuilder.buildType('api', {
                "id": "-1369215196",
                "predicate": "disabledFeature",
                "params": [
                    {
                        "name": "feature",
                        "type": "string"
                    },
                    {
                        "name": "description",
                        "type": "string"
                    }
                ],
                "type": "DisabledFeature"
            });

            var DcOption = new tl.TypeBuilder.buildType('api', {
                "id": "784507964",
                "predicate": "dcOption",
                "params": [
                    {
                        "name": "id",
                        "type": "int"
                    },
                    {
                        "name": "hostname",
                        "type": "string"
                    },
                    {
                        "name": "ip_address",
                        "type": "string"
                    },
                    {
                        "name": "port",
                        "type": "int"
                    }
                ],
                "type": "DcOption"
            });

            var Config = new tl.TypeBuilder.buildType('api', {
                "id": "2108568544",
                "predicate": "config",
                "params": [
                    {
                        "name": "date",
                        "type": "int"
                    },
                    {
                        "name": "expires",
                        "type": "int"
                    },
                    {
                        "name": "test_mode",
                        "type": "Bool"
                    },
                    {
                        "name": "this_dc",
                        "type": "int"
                    },
                    {
                        "name": "dc_options",
                        "type": "Vector<DcOption>"
                    },
                    {
                        "name": "chat_big_size",
                        "type": "int"
                    },
                    {
                        "name": "chat_size_max",
                        "type": "int"
                    },
                    {
                        "name": "broadcast_size_max",
                        "type": "int"
                    },
                    {
                        "name": "disabled_features",
                        "type": "Vector<DisabledFeature>"
                    }
                ],
                "type": "Config"
            });

            var getConfig = new tl.TypeBuilder.buildTypeFunction('api', {
                "id": "-990308245",
                "method": "help.getConfig",
                "params": [],
                "type": "Config"
            });

            var connection = new net.HttpConnection(primaryDC);
            connection.connect(function () {
                var channel = new net.RpcChannel(connection);
                auth.createAuthKey(function (ex, auth) {
                    if (ex) {
                        console.log('Auth key KO: %s', ex);
                    } else {
                        console.log('Auth key OK: %s', auth.toPrintable());

                        var sessionId = utility.createNonce(8);
                        var serverSalt = auth.serverSalt;
                        var sequenceNumber = new SequenceNumber();

                        var rpcChannel = new net.EncryptedRpcChannel(
                            connection, {
                                authKey: auth.key,
                                serverSalt: serverSalt,
                                sessionId: sessionId,
                                sequenceNumber: sequenceNumber
                            }, {
                                id: 10534,
                                version: '1.0.0'
                            }
                        );

                        getConfig({
                            prop: {},
                            channel: rpcChannel,
                            callback: function (ex, resObj, duration) {
                                if (ex) {
                                    console.log('Exception %s', ex);
                                } else {
                                    console.log('Executed: it takes %sms', duration);
                                    console.log(resObj.toPrintable());
                                    rpcChannel.close();
                                    done();
                                }
                            }
                        });
                    }
                }, channel);
            });
        });
    });
});