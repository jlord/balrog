var test = require('tap').test
var generateTemplates = require('../lib/generate-templates')
var path = require('path')
var join = path.join.bind(path)

test('generate template functions', function (t) {
  var templates = generateTemplates({
    templateDir: join(__dirname, 'test-templates'),
    partialDir: join(__dirname, 'test-partials')
  }, function (err, tpl) {
    t.ok(tpl.handlebars.partials['footer'], 'should have footer')
    t.ok(tpl.handlebars.partials['header'], 'should have header')

    t.ok(tpl.templates['main'], 'should have `main` template');

    t.same(tpl.templates.main({
      title: 'title',
      content: 'body',
    }), 'header\ntitlebodyfooter\n\n', 'should get proper template back');

    t.end()
  })
})
