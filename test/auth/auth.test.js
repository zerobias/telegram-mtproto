require('should');
require('requirish')._(module);
var auth = require('lib/auth');
var net = require('lib/net');
var primaryDC = {host: "149.154.175.10", port: "80"};
require('lib/security').PublicKey.addKey({
    fingerprint: '0xc3b42b026ce86b21',
    modulus: 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
    exponent: '010001'
});

describe('auth', function () {
    this.timeout(60000);

    describe('#createAuthKey()', function () {
        it('should returns AuthKey using a HTTP connection', function (done) {
            var connection = new net.HttpConnection(primaryDC);
            auth.createAuthKey(function (ex, auth) {
                if (ex) {
                    console.log('Auth key KO: %s', ex);
                } else {
                    auth.key.should.be.ok;
                    auth.serverSalt.should.be.ok;
                    console.log('Auth key OK: %s', auth.key.toString());
                }
                (!ex).should.be.true;
                connection.close(done);
            }, connection);
        });
    });

    describe('#createAuthKey()', function () {
        it('should returns AuthKey using a TCP connection', function (done) {
            var connection = new net.TcpConnection(primaryDC);
            auth.createAuthKey(function (ex, auth) {
                if (ex) {
                    console.log('Auth key KO: %s', ex);
                } else {
                    auth.key.should.be.ok;
                    auth.serverSalt.should.be.ok;
                    console.log('Auth key OK: %s', auth.key.toString());
                }
                (!ex).should.be.true;
                connection.close(done);
            }, connection);
        });
    });

    describe('#encryptAuthKey()', function () {
        it('should returns an encrypted buffer', function () {

            var authKey = new auth.AuthKey(
                new Buffer('4efd920588a83ac9', 'hex'),
                // padding with eight '0' to avoid random output at the end, only for test purpose
                new Buffer('33843a2caeb2452873c89349fd8f7221ba734c8df5e05c122a9e36b036995afc81057270b71b6375ae1ccf59514519748bbb0ec508dde9d17bce70e3dcf685b3731917b144710233f0d4b6a1d69b37722eaa075c5aeabde8d1848ef04af661055f52ab406ab7df8dec44a7ddcbf9de5be36ace00ecfbf5cb69b156c18a469e70658b99ecc2d1ff8de47cf573589b475833016a327f855965b7f541a9926651e50e4dcea69ebb5adbe2cc6ad49b36d38c6058c9f1fff06b07688ccb129e20aef00d77912a2f61cb82274fa86d0aa24b58c9e12cad8c751c6da2831ec635d053bd99b26a6fc83a28c64ff5c94efb5ef82356783c6f2ca0b55a074de82de553c6cb0000000000000000', 'hex')
            );
            var encrypted = auth.encryptAuthKey(authKey, 'secretword').toString('hex');
            encrypted.should.be.equal('380d03d50bf5107cab6f62486dd908876f8b1c8aca553c94bc40dab673b61a8901609c240c36a2fce8b0b7c98822e0f54aa1a8434bdac9aa1ce24a36e778f8b182331b56ceccc160c1f9dd47684211f33b9da56012ad6d02e9a900d6bec5cd0ec5863970f4c949b610a26b28560eb50792ce5c87d189240e6bd5c9f941cc770fe6642dca9f1e1742b6306b59cb8b25098b361b79ede3f0ac8e93774d6ae7aad360df95d0590c706286493799e244479acdb4ab7f5d497c9d53cd8d51638703fd0c44c4592ee0c70a8bc0b62b16e465f151e8baea78ee17e4d4fd3914d3b28c3850def6fc71d20d91c26f2bf00ed3d3851067fcd05ea4bb1414ed6cee2a0df219000bfa90e613aef642bca355ec5b2478');
        });
    });

    describe('#decryptAuthKey()', function () {
        it('should returns an decrypted authKey', function () {

            var decrypted = auth.decryptAuthKey(
                new Buffer('380d03d50bf5107cab6f62486dd908876f8b1c8aca553c94bc40dab673b61a8901609c240c36a2fce8b0b7c98822e0f54aa1a8434bdac9aa1ce24a36e778f8b182331b56ceccc160c1f9dd47684211f33b9da56012ad6d02e9a900d6bec5cd0ec5863970f4c949b610a26b28560eb50792ce5c87d189240e6bd5c9f941cc770fe6642dca9f1e1742b6306b59cb8b25098b361b79ede3f0ac8e93774d6ae7aad360df95d0590c706286493799e244479acdb4ab7f5d497c9d53cd8d51638703fd0c44c4592ee0c70a8bc0b62b16e465f151e8baea78ee17e4d4fd3914d3b28c3850def6fc71d20d91c26f2bf00ed3d3851067fcd05ea4bb1414ed6cee2a0df219000bfa90e613aef642bca355ec5b2478', 'hex'),
                'secretword'
            );
            decrypted.should.be.ok;
            decrypted.id.toString('hex').should.be.equal('4efd920588a83ac9');
            decrypted.value.toString('hex').should.be.equal('33843a2caeb2452873c89349fd8f7221ba734c8df5e05c122a9e36b036995afc81057270b71b6375ae1ccf59514519748bbb0ec508dde9d17bce70e3dcf685b3731917b144710233f0d4b6a1d69b37722eaa075c5aeabde8d1848ef04af661055f52ab406ab7df8dec44a7ddcbf9de5be36ace00ecfbf5cb69b156c18a469e70658b99ecc2d1ff8de47cf573589b475833016a327f855965b7f541a9926651e50e4dcea69ebb5adbe2cc6ad49b36d38c6058c9f1fff06b07688ccb129e20aef00d77912a2f61cb82274fa86d0aa24b58c9e12cad8c751c6da2831ec635d053bd99b26a6fc83a28c64ff5c94efb5ef82356783c6f2ca0b55a074de82de553c6cb');
        });
    });

});



