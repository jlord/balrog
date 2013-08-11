var glob = require('glob')
var marked = require('marked')
var handlebars = require('handlebars')
var $ = require('cheerio')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')

glob("*.md", function(err, postFilenames) {
  if (err) return console.log(err)
  var postNames = postFilenames.map(function(name) {
  	if (name === 'README') return
    return path.basename(name, '.md')
  })
	console.log("Root Page Names", postNames)
  parseMarkdown(postNames, '/')
})

glob("posts/*.md", function(err, postFilenames) {
  if (err) return console.log(err)
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.md')
  })
	console.log("Post Page Names", postNames)
  parseMarkdown(postNames, '/posts/')
})

function parseMarkdown(postFilenames, subDir) {
	postFilenames.forEach(function(postName) {
		var destinationDir = routeDestination(subDir)
		var raw = fs.readFileSync(__dirname + subDir + postName + '.md').toString() 
  	var postContent = marked(raw)
  	assignTemplate(subDir, postContent, postName, destinationDir)
	})
}

function assignTemplate(subDir, postContent, postName, destinationDir) {
	var assignedTemplate = ""
	var config = JSON.parse(fs.readFileSync('config.json'))
	var templates = config.templates
	if (subDir !== '/') {
		for(var key in templates) {
			console.log(key)
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
	console.log("use this template", assignedTemplate)
	// addToTemplate(postContent, postName, destinationDir, assignedTemplate)
}

function addToTemplate(postContent, postName, destinationDir, template) {
	console.log("use this template", template)
	var source = fs.readFileSync(__dirname + '/templates/' + template).toString()
  var template = handlebars.compile(source)
  var build = {content: postContent}
  writeFile(template(build), postName, destinationDir)
}

function routeDestination(subDir) {
	if (subDir === '/posts/') var destinationDir = '/blog/'
	if (subDir === '/') var destinationDir = '/'
	return destinationDir
}

function writeFile(templateBuild, postName, destinationDir) {
	fs.writeFile(__dirname + destinationDir + postName + '.html', templateBuild, function (err) {
  if (err) throw err;
  console.log('It\'s saved!')
})
}