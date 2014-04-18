var fs = require('fs')

var chooseTemplate = require('./choose-template')
var generateTemplates = require('./generate-templates.js')

module.exports = function buildHome(post, opts) {
  
  var latest = {}
  latest.title = post.content.title
  latest.content = post.content.content
  latest.url = pageURL(post.output)

  var pagePath = "index.md"
  // console.log(['latest', latest])

  generateTemplates(opts, function(err, tpl) {
    if (err) return console.log(err) // callback(err)
    var template = chooseTemplate(pagePath, opts.templates) || 'main'
    var content = latest
    var htmlOutput = tpl.templates[template](content)
    
    fs.writeFile('site/index.html', htmlOutput, function (err) {
      if (err) throw err
    })
  })
}

function pageURL(pageDir) {
  var parts = pageDir.split('/')
  var url = parts.pop()
  return url
}