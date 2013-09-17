var fs = require('fs')
var test = require('tap').test
var genSiteDir = require('../lib/generate-site-dir')
var path = require('path')

function locate(file) {
  return path.join(__dirname, 'test-sitegen', file)
}

test('generating the site dir should work, ya?', function (t) {
  var expectFiles = [
    'blog',
    'blog/post.html',
    'blog/post.md',
    'page.html',
    'page.md',
    'post1.html',
    'post1.md'
  ]
  var expectContent = 'Site\n\n<h1>blog post</h1>\n<h2>author</h2>\n<h2>date</h2>\n<h2>tag, this, post</h2>\n<p>Hi</p>\n\n';

  genSiteDir({
    source: locate('content'),
    output: locate('site'),
    templateDir: locate('templates'),
  }, function (err, result) {
    var content = fs.readFileSync(locate('/site/blog/post.html')).toString('utf-8')

    console.dir(content)
    t.same(result.files, expectFiles, 'should have all the right files!')
    t.same(content, expectContent, 'should have the right content for posts')
    t.end()
  })
})
