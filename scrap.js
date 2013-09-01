var fs = require('fs')
var path = require('path')
var $ = require('cheerio')
var glob = require('glob')
var moment = require('moment')
var _ = require('underscore')
var RSS = require('rss')
var baseURL = 'http://jlord.us'
var author = 'Jessica Lord'
var marked = require('marked')

glob("posts/*.md", function(err, postFilenames) {
  if (err) return console.log(err)
  var documents = loadDocuments()
  var postNames = postFilenames.map(function(name) {
    return path.basename(name, '.html')
  })
  postNames = _.filter(postNames, function(name) { return documents[name] })
  var sortedPostNames = _.sortBy(postNames, function(name) {
    return documents[name].published
  }).reverse()
  loadPosts(sortedPostNames)
  createRSS(documents)
})

function parseMarkdown() {
  var raw         = fs.readFileSync(__dirname + subDir + num + '.md').toString();  

}

function loadDocuments() {
  var documents = {}
  var docs = fs.readFileSync('documents.html').toString()
  var parsedDocs = $.load(docs)
  parsedDocs('.load-document').map(function(i, doc) {
    doc = $(doc)
    var docName = doc.find('.document').attr('id')
    var published = doc.find('.published').attr('data-published')
    var title = doc.find('.title').html()
    documents[docName] = {
      published: published,
      name: docName,
      title: title
    }
  })
  return documents
}

function loadPosts(sortedPostNames) {
  var documents = $.load(fs.readFileSync('documents.html').toString())
  var index = $.load(fs.readFileSync('index.html'))
  var latestPost = false
  sortedPostNames.map(function(postName) {
    var post = fs.readFileSync('posts/' + postName + '.html')
    if (!latestPost) latestPost = post
    switchNav(documents, postName)
    renderPage(index, documents.html(), post, postName + '.html')
  })
  switchNav(documents, sortedPostNames[0])
  renderPage(index, documents.html(), latestPost, 'index.html')
  renderTopNav(index)
}

function switchNav(nav, postName) {
  nav('.active').removeClass('active')
  nav('#' + postName).addClass('active')
}

function renderPage(index, nav, body, outputPath) {
  index('#documents').html(nav)
  index('#document').html(body)
  fs.writeFileSync(outputPath, index.html())
}

function renderTopNav(index) {
  renderPage(index, '', fs.readFileSync('posts/contact.html'), 'contact.html')
  renderPage(index, '', fs.readFileSync('posts/projects.html'), 'projects.html')
  renderPage(index, '', fs.readFileSync('posts/videos.html'), 'videos.html')
}

function createRSS(documents) {
  var docRSS = 'rss.xml'

  var feed = new RSS({
    title: author + ' Blog',
    description: 'Open Web Developer',
    feed_url: baseURL + docRSS,
    site_url: baseURL,
    image_url: baseURL + 'icon.png',
    author: author
  })

  var documents = _.sortBy(documents, function(doc) {
    return doc.published
  }).reverse()

  _.each(documents, function(doc) {
    feed.item({
      title:  doc.title,
      description: doc.title,
      url: baseURL + doc.name + '.html',
      date: doc.published
    })
  })

  fs.writeFileSync(docRSS, feed.xml())
}

/////////////////////

function makePage (environment, subDir, num ) {
    // Markdown
    var raw         = fs.readFileSync(__dirname + subDir + num + '.md').toString();  
    var content     = marked(raw);  

    // Handlebars
    var source      = fs.readFileSync(__dirname + '/static/index.html').toString();
    var template    = handlebars.compile(source);

    // Compose and return
    var provider    = _.extend(environment, {
        content: content
    });
    return template(provider);
}

fs.writeFile('message.txt', 'Hello Node', function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

///////////////////////

var glob = require('glob')
var marked = require('marked')
var handlebars = require('handlebars')
var $ = require('cheerio')
var fs = require('fs')
var path = require('path')
var _ = require('underscore')

glob("!(README)*.md", {nonegate:true}, function(err, postFilenames) {
  if (err) return console.log(err)
  var postNames = postFilenames.map(function(name) {
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

function findPartials(){
    glob("shared/*.html", function(err, partialFilenames) {
        if (err) return console.log(err)
        var partialNames = partialFilenames.map(function(name) {
     return path.basename(name, '.html')
    })
    return partialNames
    // console.log("got partial names", partialNames)
    // if (!err) buildPartials(partialNames)
    }) 
}

function buildPartials() {
    var partialNames = findPartials()
    console.log("BLD PARTIALS NAMES", partialNames)
    partialNames.forEach(function(partial) {
        var partialContents = fs.readFileSync(__dirname + '/shared/' + partial + '.html').toString() 
        // console.log(handlebars.registerPartial(partial, partialContents))
        // var partialTemplate = handlebars.compile(partialContents) // funct
        // console.log("partem", partialTemplate)
        // return partialTemplate
        // template(data)
        console.log("par cont", partialContents)
        var thepartial = {partial: partialContents}
        console.log("THE PARTIL", thepartial)
        return thepartial
        })
}

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

function addToTemplate(postContent, postName, destinationDir, template) {
    buildPartials()
    console.log("APR in addtemp", partials)
    // console.log("use this template", template)
    var source = partials + fs.readFileSync(__dirname + '/templates/' + template).toString()
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