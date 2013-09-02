var glob = require('glob')
var marked = require('marked')
var handlebars = require('handlebars')
var $ = require('cheerio')
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var cpr = require('cpr')
var RSS = require('RSS')

mkdirp('site/blog', function (err) {
  if (err) console.error(err)
	else loadEverything(buildSite)
})

function buildSite(data) {
	// now parse, build and write everything

	/// do it with callbacks
	parseMarkdown(data, 'pages', '/', '/site/')
	parseMarkdown(data, 'posts', '/posts/', '/site/blog/')
	parseHTML(data, 'html', '/', '/site/')
	// copy assets folder
	cpr('assets', 'site/assets', {overwrite: true}, function(errs, files) {
    console.log(errs, files)
	})
}

function loadEverything(cb) {
  var left = 4
  var data = {}
  getPosts(done)
  getPages(done)
  getHTML(done)
  getPartials(done)
  
  function done(key, value) {
    left--
    data[key] = value
    if (left === 0) cb(data)
  }
}

function getPosts(cb) {
	glob("posts/*.md", function(err, postFilenames) {
	  if (err) return console.log(err)
	  var postNames = postFilenames.map(function(name) {
	    return path.basename(name, '.md')
	  })
	  cb('posts', postNames)
	})
}

function getPages(cb) {
	glob("!(README)*.md", {nonegate:true}, function(err, postFilenames) {
	  if (err) return console.log(err)
	  var postNames = postFilenames.map(function(name) {
	    return path.basename(name, '.md')
	  })
	  cb('pages', postNames)
	})
}

function getHTML(cb) {
	glob("*.html", function(err, postFilenames) {
	  if (err) return console.log(err)
	  var postNames = postFilenames.map(function(name) {
	    return path.basename(name, '.html')
	  })
		cb('html', postNames)
	})
}

function getPartials(cb) {
	glob("shared/*.html", function(err, partialFilenames) {
	  if (err) return console.log(err)
	  var partialNames = partialFilenames.map(function(name) {
	    return path.basename(name, '.html')
	  })
	  cb('partials', partialNames)
	}) 
}

//////////////////////////////////////////////

function parseHTML(data, section, subDir, finalDir) {
	var filenames = data[section]
	filenames.forEach(function(filename) {
		var content = fs.readFileSync(__dirname + '/' + filename + '.html').toString()
		var templateMatch = assignTemplate(subDir, content, filename)
		addToTemplate(data, content, filename, finalDir, templateMatch)
	})
}

function parseMarkdown(data, section, subDir, finalDir) {
	var filenames = data[section]
	filenames.forEach(function(filename) {
		var raw = fs.readFileSync(__dirname + subDir + filename + '.md').toString() 
  	var content = marked(raw)
  	var templateMatch = assignTemplate(subDir, content, filename)
  	addToTemplate(data, content, filename, finalDir, templateMatch)
	})
}

function assignTemplate(subDir, postContent, postName) {
	var assignedTemplate = ""
	var config = JSON.parse(fs.readFileSync('config.json'))
	var templates = config.templates
	if (subDir !== '/') {
		for(var key in templates) {
			var values = templates[key] // an array
			values.forEach(function(value) {
				if (value.match(subDir)) assignedTemplate = key + '.html'
			})
		}
	}
	else {
		for(var key in templates) {
			var values = templates[key]
			values.forEach(function(value) {
				if (value.match(postName)) assignedTemplate = key + '.html'
				else return
			})
		}
	}
	return assignedTemplate
}

function addToTemplate(data, content, filename, finalDir, template) {
	var source = fs.readFileSync(__dirname + '/templates/' + template).toString()
	
	data.partials.forEach(function(partial) {
		var partialContent = fs.readFileSync(__dirname + '/shared/' + partial + '.html').toString()
		handlebars.registerPartial(partial, partialContent)
	})

  var template = handlebars.compile(source)
  var build = {content: content}
  writeFile(template(build), filename, finalDir)
}

function writeFile(build, postName, finalDir) {
	fs.writeFile(__dirname + finalDir + postName + '.html', build, function (err) {
  if (err) throw err;
})
}

function writeMetaData() {
	glob("posts/*.md", function(err, postFilenames) {
  if (err) return console.log(err)
  var metaData = []
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.md')
  })
	
  postNames.forEach(function(post) {
		var uri = 'posts/' + post + '.md'
		fs.readFile(uri, function(err, file) {
			var array = file.toString().split('\n')
			var title = array[0].match(/^(\S+)\s(.*)/).slice(2).toString()
			var author = array[1].match(/^(\S+)\s(.*)/).slice(2).toString()
			var date = array[2].match(/^(\S+)\s(.*)/).slice(2).toString()
			var tags = (array[3].match(/^(\S+)\s(.*)/).slice(2)).toString().split(',')

			var metaObject = {"title": title, "author": author, "date": date, "tags": tags}
			// console.log(metaObject)
			metaData.push(metaObject)

			console.log('meta', metaData)
		})
		// console.log('meta', metaData)
	})
	createRSS(metaData)
	})
}

function createRSS(metaData) {
  var docRSS = 'rss.xml'

  var feed = new RSS({
    title: 'Blog',
    description: 'Open Web Developer',
    feed_url: docRSS,
    site_url: "baseURL",
    image_url: 'icon.png',
    author: "author"
  })

  var metaData = metaData.reverse()

  _.each(metaData, function(doc) {
    feed.item({
      title:  doc.title,
      description: doc.title,
      url: baseURL + doc.name + '.html',
      date: doc.date
    })
  })

  fs.writeFileSync(docRSS, feed.xml())
}