require('should');
require('requirish')._(module);
var auth = require('lib/auth');

describe('AuthKey', function () {

    describe('#encryptAuthKey()', function () {
        it('should returns an encrypted buffer', function () {

            var authKey = new auth.AuthKey(
                new Buffer('4efd920588a83ac9', 'hex'),
                new Buffer('33843a2caeb2452873c89349fd8f7221ba734c8df5e05c122a9e36b036995afc81057270b71b6375ae1ccf59514519748bbb0ec508dde9d17bce70e3dcf685b3731917b144710233f0d4b6a1d69b37722eaa075c5aeabde8d1848ef04af661055f52ab406ab7df8dec44a7ddcbf9de5be36ace00ecfbf5cb69b156c18a469e70658b99ecc2d1ff8de47cf573589b475833016a327f855965b7f541a9926651e50e4dcea69ebb5adbe2cc6ad49b36d38c6058c9f1fff06b07688ccb129e20aef00d77912a2f61cb82274fa86d0aa24b58c9e12cad8c751c6da2831ec635d053bd99b26a6fc83a28c64ff5c94efb5ef82356783c6f2ca0b55a074de82de553c6cb', 'hex')
            );
            var encrypted = auth.AuthKey.encryptAuthKey(authKey, 'secretword').slice(0, -16).toString('hex');
            encrypted.should.be.equal('380d03d50bf5107cab6f62486dd908876f8b1c8aca553c94bc40dab673b61a8901609c240c36a2fce8b0b7c98822e0f54aa1a8434bdac9aa1ce24a36e778f8b182331b56ceccc160c1f9dd47684211f33b9da56012ad6d02e9a900d6bec5cd0ec5863970f4c949b610a26b28560eb50792ce5c87d189240e6bd5c9f941cc770fe6642dca9f1e1742b6306b59cb8b25098b361b79ede3f0ac8e93774d6ae7aad360df95d0590c706286493799e244479acdb4ab7f5d497c9d53cd8d51638703fd0c44c4592ee0c70a8bc0b62b16e465f151e8baea78ee17e4d4fd3914d3b28c3850def6fc71d20d91c26f2bf00ed3d3851067fcd05ea4bb1414ed6cee2a0df219');
        });
    });

    describe('#decryptAuthKey()', function () {
        it('should returns an decrypted authKey', function () {

            var decrypted = auth.AuthKey.decryptAuthKey(
                new Buffer('380d03d50bf5107cab6f62486dd908876f8b1c8aca553c94bc40dab673b61a8901609c240c36a2fce8b0b7c98822e0f54aa1a8434bdac9aa1ce24a36e778f8b182331b56ceccc160c1f9dd47684211f33b9da56012ad6d02e9a900d6bec5cd0ec5863970f4c949b610a26b28560eb50792ce5c87d189240e6bd5c9f941cc770fe6642dca9f1e1742b6306b59cb8b25098b361b79ede3f0ac8e93774d6ae7aad360df95d0590c706286493799e244479acdb4ab7f5d497c9d53cd8d51638703fd0c44c4592ee0c70a8bc0b62b16e465f151e8baea78ee17e4d4fd3914d3b28c3850def6fc71d20d91c26f2bf00ed3d3851067fcd05ea4bb1414ed6cee2a0df219000bfa90e613aef642bca355ec5b2478', 'hex'),
                'secretword'
            );
            decrypted.should.be.ok;
            decrypted.id.toString('hex').should.be.equal('4efd920588a83ac9');
            decrypted.value.toString('hex').should.be.equal('33843a2caeb2452873c89349fd8f7221ba734c8df5e05c122a9e36b036995afc81057270b71b6375ae1ccf59514519748bbb0ec508dde9d17bce70e3dcf685b3731917b144710233f0d4b6a1d69b37722eaa075c5aeabde8d1848ef04af661055f52ab406ab7df8dec44a7ddcbf9de5be36ace00ecfbf5cb69b156c18a469e70658b99ecc2d1ff8de47cf573589b475833016a327f855965b7f541a9926651e50e4dcea69ebb5adbe2cc6ad49b36d38c6058c9f1fff06b07688ccb129e20aef00d77912a2f61cb82274fa86d0aa24b58c9e12cad8c751c6da2831ec635d053bd99b26a6fc83a28c64ff5c94efb5ef82356783c6f2ca0b55a074de82de553c6cb');
        });
    });

    describe('#decryptAuthKey()', function () {
        it('should returnsnull', function () {

            var decrypted = auth.AuthKey.decryptAuthKey(
                new Buffer('380d03d50bf5107cab6f62486dd908876f8b1c8aca553c94bc40dab673b61a8901609c240c36a2fce8b0b7c98822e0f54aa1a8434bdac9aa1ce24a36e778f8b182331b56ceccc160c1f9dd47684211f33b9da56012ad6d02e9a900d6bec5cd0ec5863970f4c949b610a26b28560eb50792ce5c87d189240e6bd5c9f941cc770fe6642dca9f1e1742b6306b59cb8b25098b361b79ede3f0ac8e93774d6ae7aad360df95d0590c706286493799e244479acdb4ab7f5d497c9d53cd8d51638703fd0c44c4592ee0c70a8bc0b62b16e465f151e8baea78ee17e4d4fd3914d3b28c3850def6fc71d20d91c26f2bf00ed3d3851067fcd05ea4bb1414ed6cee2a0df219c1c58659add7586679410841457506bf', 'hex'),
                'wrongsecret'
            );
            (decrypted == null).should.be.true;
        });
    });

    describe('#derivateAesKey()', function () {
        it('should returns an derivated AES key ', function () {
            var authKey = new auth.AuthKey(
                new Buffer(0),
                new Buffer('544cf64fae5d265feeb8c4f7e2f06ea6da34535fe7f891a29e773935234388bf581c88820bfb903ae2d8f4d1e6e8203534f0fe72595e7820b47560bdee16c0a8082c3334e5919426c8035e7ae05f3e30a07826a20029ee68ab70a5c07230d4bb1278c3271ca5c397b587e25ac02bd577c1d51f3888c0cf0f6e613b44f1c1434dcc3f765c1c26027ba3250f1acaed9a91c3adb642e48408bbe3448a74795994a32ac4bc7221e44338abc8cb31aba8bd7871fc6d89f85ba38390d97a2d6ef372daa21c4238d99228cb94eef515a21ed611c4cd3e021e0bba54bb33e4e9e22a7cc1f7dd2ac5031e4acebe7f8d767312a63b1c2ee0a2d4be159294053c4631fce7f2', 'hex')
            );
            var msgKey = new Buffer('bebbe56e7e09450b24d78805b251f173', 'hex');
            var aes = authKey.derivateAesKey(msgKey, false);
            aes.key.toString('hex').should.be.equal('e8fac564111c95f763f2f0a695bc9fda5d716bbf889e765bd9fe087900993b5c');
            aes.iv.toString('hex').should.be.equal('0495113cf8a778521aab24c6874679f99fe38352441a8f5361edd2e21a840f88');
        });
    });
});



