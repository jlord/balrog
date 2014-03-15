var path = require('path')
var http = require('http')
var ecstatic = require('ecstatic')
var server = http.createServer(require('ecstatic')(path.join(process.cwd(), 'site')))

server.listen(5567)

server.on('listening', function () {
  var addr = this.address();
  console.log('listening on %s:%s', 'http://localhost', addr.port)
})
