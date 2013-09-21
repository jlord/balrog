var fs = require('fs')
var rss = require('rss')
var util = require('util')
var path = require('path')
var collect = require('./collect-files')
var parseMarkdown = require('./parse-markdown')

var readFile = fs.readFileSync.bind(fs)

module.exports = function (opts, callback) {
  opts = opts || {}
  var postsDir = opts.postsDir
  var urlPrefix = opts.urlPrefix
	var siteConfig = opts.site

  var feed = new rss({
	  title: siteConfig.title,
	  description: siteConfig.description,
	  feed_url: siteConfig.url + 'rss.xml', // TODO: don't hardcode
	  site_url: siteConfig.url,
	  image_url: siteConfig.imageUrl,
	  author: siteConfig.author
	})

  collect(postsDir, function (err, directory) {
    if (err) return callback(err)

    directory.files.map(function(file) {
      var fullPath = path.join(directory.prefix, file)
      var content = readFile(fullPath)
      return {
        name: file,
        meta: parseMarkdown(content)
      }
    }).forEach(function (doc) {
      var docUrl = util.format(
        '%s/%s/%s.html',
        siteConfig.url,
        urlPrefix,
        doc.name.replace(/\.md$/, ''))

      feed.item({
        title: doc.meta.title,
        description: doc.meta.title,
        url: docUrl,
        date: doc.meta.date,
      })
    })

    callback(null, feed.xml())
  })
}
