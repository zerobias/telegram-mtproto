//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     MTProto module
//
// This module provide the `MTProto classes & method` as defined by the Telegram specification. The MTProto
// is the standard protocol to communicate with the Telegram data-center.

// Import dependencies
var util = require('util');
var crypto = require("./crypto-util");
var TypeObject = require("telegram-tl-node").TypeObject;
var TypeBuilder = require("telegram-tl-node").TypeBuilder;

// MtProto API as provided by Telegram
var api = {"constructors": [
    {"id": "481674261", "predicate": "vector", "params": [], "type": "Vector t"},
    {"id": "85337187", "predicate": "resPQ", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "pq", "type": "bytes"},
        {"name": "server_public_key_fingerprints", "type": "Vector<long>"}
    ], "type": "ResPQ"},
    {"id": "-2083955988", "predicate": "p_q_inner_data", "params": [
        {"name": "pq", "type": "bytes"},
        {"name": "p", "type": "bytes"},
        {"name": "q", "type": "bytes"},
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "new_nonce", "type": "int256"}
    ], "type": "P_Q_inner_data"},
    {"id": "2043348061", "predicate": "server_DH_params_fail", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "new_nonce_hash", "type": "int128"}
    ], "type": "Server_DH_Params"},
    {"id": "-790100132", "predicate": "server_DH_params_ok", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "encrypted_answer", "type": "bytes"}
    ], "type": "Server_DH_Params"},
    {"id": "-1249309254", "predicate": "server_DH_inner_data", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "g", "type": "int"},
        {"name": "dh_prime", "type": "bytes"},
        {"name": "g_a", "type": "bytes"},
        {"name": "server_time", "type": "int"}
    ], "type": "Server_DH_inner_data"},
    {"id": "1715713620", "predicate": "client_DH_inner_data", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "retry_id", "type": "long"},
        {"name": "g_b", "type": "bytes"}
    ], "type": "Client_DH_Inner_Data"},
    {"id": "1003222836", "predicate": "dh_gen_ok", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "new_nonce_hash1", "type": "int128"}
    ], "type": "Set_client_DH_params_answer"},
    {"id": "1188831161", "predicate": "dh_gen_retry", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "new_nonce_hash2", "type": "int128"}
    ], "type": "Set_client_DH_params_answer"},
    {"id": "-1499615742", "predicate": "dh_gen_fail", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "new_nonce_hash3", "type": "int128"}
    ], "type": "Set_client_DH_params_answer"},
    {"id": "-212046591", "predicate": "rpc_result", "params": [
        {"name": "req_msg_id", "type": "long"},
        {"name": "result", "type": "Object"}
    ], "type": "RpcResult"},
    {"id": "558156313", "predicate": "rpc_error", "params": [
        {"name": "error_code", "type": "int"},
        {"name": "error_message", "type": "string"}
    ], "type": "RpcError"},
    {"id": "1579864942", "predicate": "rpc_answer_unknown", "params": [], "type": "RpcDropAnswer"},
    {"id": "-847714938", "predicate": "rpc_answer_dropped_running", "params": [], "type": "RpcDropAnswer"},
    {"id": "-1539647305", "predicate": "rpc_answer_dropped", "params": [
        {"name": "msg_id", "type": "long"},
        {"name": "seq_no", "type": "int"},
        {"name": "bytes", "type": "int"}
    ], "type": "RpcDropAnswer"},
    {"id": "155834844", "predicate": "future_salt", "params": [
        {"name": "valid_since", "type": "int"},
        {"name": "valid_until", "type": "int"},
        {"name": "salt", "type": "long"}
    ], "type": "FutureSalt"},
    {"id": "-1370486635", "predicate": "future_salts", "params": [
        {"name": "req_msg_id", "type": "long"},
        {"name": "now", "type": "int"},
        {"name": "salts", "type": "vector<future_salt>"}
    ], "type": "FutureSalts"},
    {"id": "880243653", "predicate": "pong", "params": [
        {"name": "msg_id", "type": "long"},
        {"name": "ping_id", "type": "long"}
    ], "type": "Pong"},
    {"id": "-501201412", "predicate": "destroy_session_ok", "params": [
        {"name": "session_id", "type": "long"}
    ], "type": "DestroySessionRes"},
    {"id": "1658015945", "predicate": "destroy_session_none", "params": [
        {"name": "session_id", "type": "long"}
    ], "type": "DestroySessionRes"},
    {"id": "-1631450872", "predicate": "new_session_created", "params": [
        {"name": "first_msg_id", "type": "long"},
        {"name": "unique_id", "type": "long"},
        {"name": "server_salt", "type": "long"}
    ], "type": "NewSession"},
    {"id": "1945237724", "predicate": "msg_container", "params": [
        {"name": "messages", "type": "vector<%Message>"}
    ], "type": "MessageContainer"},
    {"id": "1538843921", "predicate": "message", "params": [
        {"name": "msg_id", "type": "long"},
        {"name": "seqno", "type": "int"},
        {"name": "bytes", "type": "int"},
        {"name": "body", "type": "Object"}
    ], "type": "Message"},
    {"id": "-530561358", "predicate": "msg_copy", "params": [
        {"name": "orig_message", "type": "Message"}
    ], "type": "MessageCopy"},
    {"id": "812830625", "predicate": "gzip_packed", "params": [
        {"name": "packed_data", "type": "bytes"}
    ], "type": "Object"},
    {"id": "1658238041", "predicate": "msgs_ack", "params": [
        {"name": "msg_ids", "type": "Vector<long>"}
    ], "type": "MsgsAck"},
    {"id": "-1477445615", "predicate": "bad_msg_notification", "params": [
        {"name": "bad_msg_id", "type": "long"},
        {"name": "bad_msg_seqno", "type": "int"},
        {"name": "error_code", "type": "int"}
    ], "type": "BadMsgNotification"},
    {"id": "-307542917", "predicate": "bad_server_salt", "params": [
        {"name": "bad_msg_id", "type": "long"},
        {"name": "bad_msg_seqno", "type": "int"},
        {"name": "error_code", "type": "int"},
        {"name": "new_server_salt", "type": "long"}
    ], "type": "BadMsgNotification"},
    {"id": "2105940488", "predicate": "msg_resend_req", "params": [
        {"name": "msg_ids", "type": "Vector<long>"}
    ], "type": "MsgResendReq"},
    {"id": "-630588590", "predicate": "msgs_state_req", "params": [
        {"name": "msg_ids", "type": "Vector<long>"}
    ], "type": "MsgsStateReq"},
    {"id": "81704317", "predicate": "msgs_state_info", "params": [
        {"name": "req_msg_id", "type": "long"},
        {"name": "info", "type": "bytes"}
    ], "type": "MsgsStateInfo"},
    {"id": "-1933520591", "predicate": "msgs_all_info", "params": [
        {"name": "msg_ids", "type": "Vector<long>"},
        {"name": "info", "type": "bytes"}
    ], "type": "MsgsAllInfo"},
    {"id": "661470918", "predicate": "msg_detailed_info", "params": [
        {"name": "msg_id", "type": "long"},
        {"name": "answer_msg_id", "type": "long"},
        {"name": "bytes", "type": "int"},
        {"name": "status", "type": "int"}
    ], "type": "MsgDetailedInfo"},
    {"id": "-2137147681", "predicate": "msg_new_detailed_info", "params": [
        {"name": "answer_msg_id", "type": "long"},
        {"name": "bytes", "type": "int"},
        {"name": "status", "type": "int"}
    ], "type": "MsgDetailedInfo"}
], "methods": [
    {"id": "1615239032", "method": "req_pq", "params": [
        {"name": "nonce", "type": "int128"}
    ], "type": "ResPQ"},
    {"id": "-686627650", "method": "req_DH_params", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "p", "type": "bytes"},
        {"name": "q", "type": "bytes"},
        {"name": "public_key_fingerprint", "type": "long"},
        {"name": "encrypted_data", "type": "bytes"}
    ], "type": "Server_DH_Params"},
    {"id": "-184262881", "method": "set_client_DH_params", "params": [
        {"name": "nonce", "type": "int128"},
        {"name": "server_nonce", "type": "int128"},
        {"name": "encrypted_data", "type": "bytes"}
    ], "type": "Set_client_DH_params_answer"},
    {"id": "1491380032", "method": "rpc_drop_answer", "params": [
        {"name": "req_msg_id", "type": "long"}
    ], "type": "RpcDropAnswer"},
    {"id": "-1188971260", "method": "get_future_salts", "params": [
        {"name": "num", "type": "int"}
    ], "type": "FutureSalts"},
    {"id": "2059302892", "method": "ping", "params": [
        {"name": "ping_id", "type": "long"}
    ], "type": "Pong"},
    {"id": "-213746804", "method": "ping_delay_disconnect", "params": [
        {"name": "ping_id", "type": "long"},
        {"name": "disconnect_delay", "type": "int"}
    ], "type": "Pong"},
    {"id": "-414113498", "method": "destroy_session", "params": [
        {"name": "session_id", "type": "long"}
    ], "type": "DestroySessionRes"},
    {"id": "-1835453025", "method": "http_wait", "params": [
        {"name": "max_delay", "type": "int"},
        {"name": "wait_after", "type": "int"},
        {"name": "max_wait", "type": "int"}
    ], "type": "HttpWait"}
]};

// Declare the `mtproto` module
var mtproto = { _id: 'mtproto'};

//     PlainMessage class
//
// This class provide a plain wrapper for message as defined in MTProto
//
// To get an instance for `serialization`:
//
//     new PlainMessage({message: myMessageBuffer});
// Provide the payload as `Buffer`:
//
// To get an instance for `de-serialization`:
//
//     new PlainMessage({buffer: myBuffer});
// Provide a `buffer` containing the plain message from which extract the payload
//
// The `constructor`:
mtproto.PlainMessage = function (options) {
    var super_ = this.constructor.super_.bind(this);
    var opts = options ? options : {};
    this._message = opts.message;
    super_(opts.buffer, opts.offset);
    if (this._message) {
        this._message = Buffer.isBuffer(this._message) ? this._message : new Buffer(this._message, 'hex');
        this._authKeyId = 0;
        this._messageId = crypto.createMessageId();
        this._messageLength = this._message.length;
    }
    this._logger = require('get-log')('mtproto.PlainMessage');
};

util.inherits(mtproto.PlainMessage, TypeObject);

// This method serialize the PlainMessage
mtproto.PlainMessage.prototype.serialize = function () {
    if (!this._message) {
        return false;
    }
    this.writeLong(this._authKeyId);
    this.writeLong(this._messageId);
    this.writeInt(this._messageLength);
    // call low level method
    this._writeBytes(this._message);
    if (this._logger.isDebugEnabled()) this._logger.debug('Serialize message(%s) with authKeyId: %s, messageId: %s and writeOffset: %s',
        this._messageLength, this._authKeyId, this._messageId, this._writeOffset);
    return this.retrieveBuffer();
};

// This method de-serialize the PlainMessage
mtproto.PlainMessage.prototype.deserialize = function () {
    if (!this.isReadonly()) {
        return false;
    }
    this._authKeyId = this.readLong();
    this._messageId = this.readLong();
    this._messageLength = this.readInt();
    this._message = this._readBytes(this._messageLength);
    if (this._logger.isDebugEnabled()) this._logger.debug('De-serialize message(%s) with authKeyId: %s and messageId: %s',
        this._messageLength, this._authKeyId, this._messageId);
    return this;
};

// This method returns the payload
mtproto.PlainMessage.prototype.getMessage = function () {
    return this._message;
};

// This method returns the message ID
mtproto.PlainMessage.prototype.getMessageId = function () {
    return this._messageId;
};

// Register the `TypeLanguage class` list
mtproto._classes = ['ResPQ', 'P_Q_inner_data', 'Server_DH_Params', 'Server_DH_inner_data', 'Client_DH_Inner_Data', 'Set_client_DH_params_answer'];

// Build registered classes
TypeBuilder.buildTypes(api.constructors, mtproto._classes, mtproto);

// Register the `TypeLanguage method` list
mtproto._methods = ['req_pq', 'req_DH_params', 'set_client_DH_params'];

// Build registered methods
TypeBuilder.buildTypes(api.methods, mtproto._methods, mtproto, mtproto.PlainMessage);

// Export the package
module.exports = exports = mtproto;