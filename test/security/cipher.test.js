require('requirish')._(module);
require('should');
var cipher = require('lib/security/').cipher;
var PublicKey = require('lib/security').PublicKey;
var utility = require('lib/utility');

describe('cipher', function () {
    var rsaEncrypted = 'ab2d475c00ebc3e3718cb6c29fad518bca6a1a1a7c2c75886b09e85215a1ac28cd01eee8d4a7023f771b4a30a6c8fe2b64c2940e2c363203f1079af6dff7f8351f76ef70ef951ed78e1864732d5ff9630aff6ae8d19ced047dafb3fa5cf10aee9d46886a8555f041cea128f262af204ee923be94a6b13e8952db0cb20ff68d77e368a44135298289757bda184b01b464f2d5becc60264febdef54236934bba352f3db303a1b89dda31b6ebf8c9fbaba9f17e4bfb660dc3d8fec51df36df6b58ed666c8245e496c6ec8dbe439e1d01cfb86544001ced693b34081ec1fa699c5fe99fb980230cf48bd6ccca8a48c980439ea50d846befbf3bd62a92bd0959135ac';
    var aesEncrypted = '5bd4fb32f7e1e4082579b8b20a121aa8e89358b7e887e22e9d8a9454bc3f028125ea188a0c836d47610c4d879468470d';

    describe('#rsaEncrypt()', function () {
        it('should encrypt a message', function () {

            PublicKey.addKey({
                fingerprint: '0x9a996a1db11c729b',
                modulus: 'c6aeda78b02a251db4b6441031f467fa871faed32526c436524b1fb3b5dca28efb8c089dd1b46d92c895993d87108254951c5f001a0f055f3063dcd14d431a300eb9e29517e359a1c9537e5e87ab1b116faecf5d17546ebc21db234d9d336a693efcb2b6fbcca1e7d1a0be414dca408a11609b9c4269a920b09fed1f9a1597be02761430f09e4bc48fcafbe289054c99dba51b6b5eb7d9c3a2ab4e490545b4676bd620e93804bcac93bf94f73f92c729ca899477ff17625ef14a934d51dc11d5f8650a3364586b3a52fcff2fedec8a8406cac4e751705a472e55707e3c8cd5594342b119c6c3293532d85dbe9271ed54a2fd18b4dc79c04a30951107d5639397',
                exponent: '010001'
            });
            var key = PublicKey.retrieveKey('0x9a996a1db11c729b');
            key.should.be.ok;
            var message = new Buffer(255);
            message.fill(1);
            var encryptedMsg = cipher.rsaEncrypt(message, key).toString('hex');
            encryptedMsg.should.be.equal(rsaEncrypted);
        })
    });

    describe('#aesEncrypt()', function () {
        it('should encrypt a message', function () {
            var buffer = new Buffer(255);
            buffer.fill(1);
            var aesKey = utility.createSHAHash(buffer);
            var aesIv = utility.createSHAHash(buffer);
            var plainMsg = new Buffer('A plain-text message to be encrypted / decrypted');
            var encryptedMsg = cipher.aesEncrypt(plainMsg, aesKey, aesIv).toString('hex');
            encryptedMsg.should.be.equal(aesEncrypted);
        })
    });

    describe('#aesDecrypt()', function () {
        it('should decrypt an encrypted message', function () {
            var buffer = new Buffer(255);
            buffer.fill(1);
            var aesKey = utility.createSHAHash(buffer);
            var aesIv = utility.createSHAHash(buffer);
            var encryptedMsg = new Buffer(aesEncrypted, 'hex');
            var plainMsg = cipher.aesDecrypt(encryptedMsg, aesKey, aesIv).toString();
            plainMsg.should.be.equal('A plain-text message to be encrypted / decrypted');
        })
    });
});

