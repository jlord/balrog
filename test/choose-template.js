var test = require('tap').test
var choose = require('../lib/choose-template')

test('picking a template', function (t) {
  var tpl = {
    posts: ['posts/*'],
    'deep-posts': 'posts/**',
    archive: ['archive.md', 'old-archive.md'],
    pizza: ['pizza.md', '/pizza/margarita/delicious.md'],
  }

  t.same(choose('posts/hello-world.md', tpl), 'posts', 'shoulda picked posts')
  t.same(choose('posts/a/some-other-post.md', tpl), 'deep-posts', 'should recurse when necessary')
  t.same(choose('/old-archive.md', tpl), 'archive', 'should properly match multiarray')
  t.same(choose('pizza/margarita/delicious.md', tpl), 'pizza', 'should properly match w/o leading slash')
  t.end()
})
