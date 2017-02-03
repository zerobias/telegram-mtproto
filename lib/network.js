module.exports = {
  http: require('./net/http-connection'),
  tcp : require('./net/tcp-connection'),
  ws  : require('./net/websocket-connection')
}