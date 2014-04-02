var fs = require('fs')

var chooseTemplate = require('./choose-template')
var generateTemplates = require('./generate-templates')


module.exports = function createArchive(posts, opts) {
  var pagePath = 'archive.html'
  var postsArchiveData =  {rows: []}

  posts.forEach(function(post) {
    postData = {}
    postData.title = post.content.title
    postData.date = post.content.date
    postData.tags = post.content.tags 
    postData.url = pageURL(post.output)
    postsArchiveData.rows.push(postData)
  })

  generateTemplates(opts, function(err, tpl) {
    if (err) return console.log(err) // callback(err)

    var template = chooseTemplate('archive.html', opts.templates) || 'main'
    var htmlOutput = tpl.templates[template](postsArchiveData)

    fs.writeFile('site/blog/' + pagePath, htmlOutput, function (err) {
      if (err) throw err
    })
  })
}

 function pageURL(pageDir) {
  var parts = pageDir.split('/')
  var url = parts.pop()
  return url
}

