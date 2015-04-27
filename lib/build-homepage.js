var fs = require('fs')
var cheerio = require('cheerio')

var chooseTemplate = require('./choose-template')
var generateTemplates = require('./generate-templates.js')

module.exports = function buildHome(post, opts) {
  var latest = {}
  latest.title = post.content.title
  latest.content = post.content.content
  latest.url = pageURL(post.output)
  latest.date = post.content.date

  latest = truncate(latest)
  var pagePath = "index.md"

  generateTemplates(opts, function(err, tpl) {
    if (err) return console.log(err) // callback(err)
    var template = chooseTemplate(pagePath, opts.templates) || 'main'
    var content = latest
    var htmlOutput = tpl.templates[template](content)

    // fs.writeFile('site/index.html', htmlOutput, function (err) {
    fs.writeFile('index.html', htmlOutput, function (err) {
      if (err) throw err
    })
  })
}

function pageURL(pageDir) {
  var parts = pageDir.split('/')
  var url = parts.pop()
  return url
}

function truncate(post) {
  post.fixed = post.content.replace(/<(\s*)img[^<>]*>/i, '')
  post.fixed = post.content.replace(/<(\s*)iframe[^<>]*>/i, '')
  post.fixed = post.fixed.substring(0, 300)

  // TODO check for other things like links, ugh

  // one weird trick for if you have a short paragraph at the top of a post
  // and the ... ends up being in a weird place
  $ = cheerio.load(post.fixed)
  if ($('p')) {
    var string = $('p').html()
    post.fixed = '<p>' + string.substring(0, string.length - 1) + '…</p>'
    return post
  }
  return post
}
