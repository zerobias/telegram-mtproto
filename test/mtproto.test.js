require('requirish')._(module);
require('should');
var mtproto = require('lib/mtproto');

describe('mtproto', function () {

    describe('.type namespace', function () {
        it('should be not empty', function () {
            mtproto.type.should.be.ok;
            mtproto.type.should.have.properties(['ResPQ', 'P_q_inner_data', 'Server_DH_inner_data', 'Client_DH_inner_data', 'Message']);
        })
    });
    describe('.service namespace', function () {
        it('should be not empty', function () {
            mtproto.service.should.be.ok;
            mtproto.service.should.have.properties(['req_pq', 'req_DH_params', 'set_client_DH_params']);
        })
    });
});
