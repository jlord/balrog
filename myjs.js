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
    return path.basename(name, '.md')
  })
  parseMarkdown(postNames, '/')
})

glob("posts/*.md", function(err, postFilenames) {
  if (err) return console.log(err)
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.md')
  })
  parseMarkdown(postNames, '/posts/')
})

// function parseFileName() {

// }

function parseMarkdown(postFilenames, subDir) {
	postFilenames.forEach(function(postName) {
		var destinationDir = routeDestination(subDir)
		var raw = fs.readFileSync(__dirname + subDir + postName + '.md').toString() 
  	var postContent = marked(raw)
  	addToTemplate(postContent, postName, destinationDir)
  	console.log('Parsed Markdown')
	})
}

function addToTemplate(postContent, postName, destinationDir) {
	var source = fs.readFileSync(__dirname + '/templates/single-post.html').toString()
  var template = handlebars.compile(source)
  var build = {content: postContent}
  writeFile(template(build), postName, destinationDir)
  console.log('Added to Template')
}

function routeDestination(subDir) {
	if (subDir === '/posts/') var destinationDir = '/blog/'
	if (subDir === '/') var destinationDir = '/'
	console.log('Routed Destination', destinationDir)
	return destinationDir
}

function writeFile(templateBuild, postName, destinationDir) {
	fs.writeFile(__dirname + destinationDir + postName + '.html', templateBuild, function (err) {
  if (err) throw err;
  console.log('It\'s saved!')
})
}