var test = require('tap-prettify').test
var collect = require('../lib/collect-files')
var path = require('path')

var TEST_DIR = 'test-content'

test('collect file contents from a place', function (t) {
  var prefix = path.join(__dirname, TEST_DIR)
  var expects = [ '/dir1', '/dir1/file1', '/file2' ];

  collect(prefix, function (err, collection) {
    t.same(prefix, collection.prefix, 'prefix should be correct')
    t.same(expects, collection.files, 'files should match');
    t.end()
  })
})
