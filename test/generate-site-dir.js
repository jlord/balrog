var fs = require('fs')
var test = require('tap').test
var genSiteDir = require('../lib/generate-site-dir')
var path = require('path')

function locate(file) {
  return path.join(__dirname, 'test-sitegen', file)
}

function readFile(file) {
  return fs.readFileSync(locate(file)).toString('utf-8')
}

test('generating the site dir should work, ya?', function (t) {
  var expectFiles = [
    'about.html',
    'about.md',
    'blog',
    'blog/post.html',
    'blog/post.md',
    'page.html',
    'page.md',
  ].sort()

  var expectPostContent = 'Site, blog\n\n<h1>blog post</h1>\n<h2>author</h2>\n<h2>date</h2>\n<h2>tag, this, post</h2>\n<p>Hi</p>\n\n'
  var expectAboutContent = 'Site, about\n\n<p><em>about page</em></p>\n\n'

  genSiteDir({
    source: locate('content'),
    output: locate('site'),
    templateDir: locate('templates'),
    templates: {
      blog: 'blog/*',
      about: 'about.md'
    }
  }, function (err, result) {
    var aboutContent = readFile('/site/about.html')
    var postContent = readFile('/site/blog/post.html')

    t.same(result.files.sort(), expectFiles, 'should have all the right files!')
    t.same(postContent, expectPostContent, 'should have the right content for posts')
    t.same(aboutContent, expectAboutContent, 'should have the right content for about page')
    t.end()
  })
})
