var path = require('path')
var http = require('http')
var ecstatic = require('ecstatic')
var server = http.createServer(require('ecstatic')(path.join(__dirname, '..', 'site')))

server.listen(0)

server.on('listening', function () {
  var addr = this.address();
  console.log('listening on %s:%s', 'http://localhost', addr.port)
})
