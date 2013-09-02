var fs = require('fs')
var glob = require('glob')
var path = require('path')
var RSS = require('rss')
var _ = require('underscore')

module.exports = function() {
  getPosts(createMetaData)
}

function getPosts(cb) {
	glob("posts/*.md", function(err, postFilenames) {
	  if (err) return console.log(err)
	  var postNames = postFilenames.map(function(name) {
	    return path.basename(name, '.md')
	  })
	cb(postNames)
	})
}
		
	function createMetaData(postNames) {
		var metaData = []
		postNames.forEach(function(name) {
			var uri = 'posts/' + name + '.md'
			fs.readFile(uri, 'utf8', function(err, file) {

				var array = file.toString().split('\n')
				var url = name
				var title = array[0].match(/^(\S+)\s(.*)/).slice(2).toString()
				var author = array[1].match(/^(\S+)\s(.*)/).slice(2).toString()
				var date = array[2].match(/^(\S+)\s(.*)/).slice(2).toString()
				var tags = (array[3].match(/^(\S+)\s(.*)/).slice(2)).toString().split(',')

				var metaObject = {"url": url, "title": title, "author": author, "date": date, "tags": tags}
				metaData.push(metaObject)

				createRSS(metaData)
			})
		})
	}

	function createRSS(metaData) {
	  var docRSS = 'rss.xml'
	  var config = JSON.parse(fs.readFileSync('config.json'))

	  var feed = new RSS({
	    title: config.site_title,
	    description: config.site_description,
	    feed_url: config.site_url + docRSS,
	    site_url: config.site_url,
	    image_url: config.icon,
	    author: config.site_author
	  })

	  var metaData = metaData.reverse()

	  _.each(metaData, function(doc) {
	    feed.item({
	      title:  doc.title,
	      description: doc.title,
	      url: config.site_url + doc.url + '.html',
	      date: doc.date
	    })
	  })

	  fs.writeFileSync(docRSS, feed.xml())
	}