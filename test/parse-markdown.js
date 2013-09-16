var test = require('tap-prettify').test
var parser = require('../lib/parse-markdown')
var fs = require('fs')
var path = require('path')


function getFileContents(name) {
  var filePath = path.join(__dirname, 'markdown-files', name)
  return fs.readFileSync(filePath)
}

test('make sure we get the correct data from markdown file', function (t) {
  var expect = {
    title: 'Title',
    author: 'Author',
    date: 'Date',
    tags: [ 'tag1', 'tag2', 'tag3' ] }
  var result = parser(getFileContents('title-author-date-tags.md'))
  t.same(expect, result.meta, 'should get right metadata back')
  t.end()
})

test('some pages will be pages and not posts', function (t) {
  var expect = {
    title: 'Title',
    author: undefined,
    date: undefined,
    tags: undefined,
  }
  var result = parser(getFileContents('page-not-post.md'))
  t.same(expect, result.meta, 'should only populate title')
  t.end()
})
