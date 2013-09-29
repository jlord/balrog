var glob = require('glob')
var marked = require('marked')
var handlebars = require('handlebars')
var $ = require('cheerio')
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var cpr = require('cpr')
var RSS = require('RSS')
var genRSS = require('./meta.js')

getMarkdown("contents/", parseMarkdown)
getMarkdown("contents/posts/", parseMarkdown)
getHTML(parseHTML)
var partials = getPartials(function(value) {return value})

/////////////// Get Files 

function getMarkdown(directory, cb) {
  // glob("contents/**/*.md", function(err, filenames) {
  glob(directory + "*.md", function(err, filenames) {
    if (err) return console.log(err)
    var postNames = filenames.map(function(name) {
      return path.basename(name, '.md')
    })
    cb(postNames, directory, assignTemplate)
  })
}

function getHTML(cb) {
  glob("contents/*.html", function(err, postFilenames) {
    if (err) return console.log(err)
    var postNames = postFilenames.map(function(name) {
      return path.basename(name, '.html')
    })
    cb(postNames, "contents/")
  })
}

function getPartials(cb) {
  glob("templates/partials/*.html", function(err, partialFilenames) {
    if (err) return console.log(err)
    var partialNames = partialFilenames.map(function(name) {
      return path.basename(name, '.html')
    })
    cb(partialNames)
  }) 
}

function checkConfig(key) {
  var config = JSON.parse(fs.readFileSync('config.json'))
  var value = config[key]
  return value
}

/////////////// Parse Files

function parseHTML(data, originDir) {
  data.forEach(function(filename) {
    var content = fs.readFileSync(__dirname + '/' + originDir + filename + '.html').toString()
    // var templateMatch = assignTemplate(subDir, content, filename)
    // addToTemplate(data, content, filename, finalDir, templateMatch)
    // console.log(content)
  })
}

function parseMarkdown(data, originDir, cb) {
  data.forEach(function(filename) {
    var raw = fs.readFileSync(__dirname + '/' + originDir + filename + '.md').toString() 
    var content = marked(raw)
    if (routePosts(originDir)) buildIndex(content)
    // console.log(content)
    cb(originDir, content, filename, addToTemplate)
    // addToTemplate(data, content, filename, finalDir, template)
  })
}

function routePosts(originDir) {
  if (originDir.match("posts")) {return true}
}

function assignTemplate(originDir, content, filename, cb) {
  var assignedTemplate = ""
  var config = JSON.parse(fs.readFileSync('config.json'))
  var templates = config.templates
  if (originDir !== '/') {
    for(var key in templates) {
      var values = templates[key] // an array
      values.forEach(function(value) {
        if (value.match(originDir)) assignedTemplate = key + '.html'
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
  if (routePosts(originDir)) {
    var finalDir = "contents/posts"
    cb(partials, content, filename, finalDir, assignedTemplate)
  } else {
    var finalDir = "contents"
    cb(partials, content, filename, finalDir, assignedTemplate)
  }
  
}

function addToTemplate(partials, content, filename, finalDir, template) {
  var source = fs.readFileSync(__dirname + '/templates/' + template).toString()
  
  partials.forEach(function(partial) {
    var partialContent = fs.readFileSync(__dirname + '/templates/partials/' + partial + '.html').toString()
    handlebars.registerPartial(partial, partialContent)
  })

  var template = handlebars.compile(source)
  var build = {content: content}
  writeFile(template(build), filename, finalDir)
}

function writeFile(build, postName, finalDir) {
  fs.writeFile(__dirname + finalDir + postName + '.html', build, function (err) {
  if (err) throw err
  // else genRSS()
})
}

//////// Build Page

function buildIndex(content) {
  // addToTemplate(partials, content, "index", "site/", "flat-page.html")
  // var counter = 0
  // var ppp = checkConfig("posts_per_page")
  // console.log("ppp", ppp)
  // fs.appendFile('site/index.html', content, function (err) {
  //   counter++
  //   if (err) throw err
  //   console.log('It\'s saved!')
  // })
  // console.log(counter)
}