var glob = require('glob')
var marked = require('marked')
var handlebars = require('handlebars')
var $ = require('cheerio')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')

// These are site Pages, not blog posts,
// they're located in the root
// ignore the readme.md
glob("!(README)*.md", {nonegate:true}, function(err, postFilenames) {
  if (err) return console.log(err)
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.md')
  })
	// console.log("STEP ONE: Root Page Names", postNames)
  parseMarkdown(postNames, '/')
})

// Get all of the posts which are located
// in the posts folder
glob("posts/*.md", function(err, postFilenames) {
  if (err) return console.log(err)
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.md')
  })
	// console.log("STEP TWO: Post Page Names", postNames)
  parseMarkdown(postNames, '/posts/')
})

// Get any pages already written as HTML
glob("*.html", function(err, postFilenames) {
  if (err) return console.log(err)
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.html')
  })
	postNames.forEach(function(postName) {
		var content = fs.readFileSync(__dirname + '/' + postName + '.html').toString()
		// console.log("STEP THREE: Found HTML Files", postNames, content)
	})
	
})

// parse the markdown
// find/add partial templates?
// subDir is where the file orginated, id'ing its
function parseMarkdown(postFilenames, subDir) {
	postFilenames.forEach(function(postName) {
		var destinationDir = routeDestination(subDir)
		var raw = fs.readFileSync(__dirname + subDir + postName + '.md').toString() 
  	var postContent = marked(raw)
  	assignTemplate(subDir, postContent, postName, destinationDir)
	 //  var partials = findPartials(function (partials){
		// 	assignTemplate(subDir, postContent, postName, destinationDir, partials)
		// 	console.log('early partials', partials)
		// })
	})

}

// assign the page its correct template
function assignTemplate(subDir, postContent, postName, destinationDir) {
	var assignedTemplate = ""
	var config = JSON.parse(fs.readFileSync('config.json'))
	var templates = config.templates
	if (subDir !== '/') {
		for(var key in templates) {
			// console.log(key)
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
	// console.log("use this template", assignedTemplate)
	addToTemplate(postContent, postName, destinationDir, assignedTemplate)
}


// insert content into the template
function addToTemplate(postContent, postName, destinationDir, template) {
	var source = fs.readFileSync(__dirname + '/templates/' + template).toString()
	// console.log('SOURCE', source)

	// for (var key in partials) {
 //  	var obj = partials[key]
 //  	console.log('obj', obj, 'key', key)
 //  	// handlebars.registerPartial( key, obj)
 //  }

	handlebars.registerPartial('header', '<p>Hi the header</p>')

	// console.log("SOUCRE", source)
  var template = handlebars.compile(source)
  var build = {content: postContent}
  writeFile(template(build), postName, destinationDir)
}

// go fetch partial names
glob("shared/*.html", function(err, partialFilenames) {
  if (err) return console.log(err)
  var partialNames = partialFilenames.map(function(name) {
    return path.basename(name, '.html')
  })
  console.log('the partial names', partialNames)
  return partialsContent(partialNames)
}) 

function partialsContent(partialNames) {
	console.log('i got the partial names', partialNames)
	var partialsContent = {}
	partialNames.forEach(function (partial) {
		partialsContent[partial] = fs.readFileSync(__dirname + '/shared/' + partial + '.html').toString()
	})
	console.log('content', partialsContent)
	return partialsContent
}


// route the page's destination
function routeDestination(subDir) {
	if (subDir === '/posts/') var destinationDir = '/blog/'
	if (subDir === '/') var destinationDir = '/'
	return destinationDir
}

// write the file
// need to also make it make the directories if they don't exist
function writeFile(templateBuild, postName, destinationDir) {
	// console.log(templateBuild)
	fs.writeFile(__dirname + destinationDir + postName + '.html', templateBuild, function (err) {
  if (err) throw err;
  // console.log('It\'s saved!')
})
}