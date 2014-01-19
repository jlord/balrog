var handlebars = require('handlebars')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')

var generateTemplates = require('./generate-templates.js')
var chooseTemplate = require('./choose-template')

var writeFile = fs.writeFileSync.bind(fs)

module.exports = function makePages(filesAndContent, opts) { // add back callback
  
  var posts = separatePosts(filesAndContent)
  var totalPosts = posts.length
  var totalPages = Math.ceil(totalPosts / opts.pagination)
  var pagination = opts.pagination || 5
  generatePages(totalPages, opts, posts)

  function generatePages(totalPages, opts, posts) {
    var ppp = opts.pagination
    
    generateTemplates(opts, function (err, tpl) {
      if (err) return console.log(err) // callback(err)
      
      mkdirp('site/blog/page/', function() {
        
        for (var i = 0; i < totalPages; i++) {
          var pagesPosts = []
          pagesPosts.push(posts.slice((i * ppp), ((i + 1) * ppp)))
          var content = { "content": pagesPosts.pop() }
          var pagePath = 'page/' + i + '.html'
          var template = chooseTemplate(pagePath, opts.templates) || 'main'
          var htmlOutput = tpl.templates[template](content)
          writeFile('site/blog/' + pagePath, htmlOutput)
          // fs.writeFile('site/blog/' + pagePath, htmlOutput.toString(), function (err) {
          //   if (err) throw err
          // })
        } 
      }) 
    }) 
  } 

}

function separatePosts (filesAndContent) {
  var posts = []
  filesAndContent.forEach(function(item) {
    if (item.output.match('/blog/'))
      posts.push(item)
  })
  // sort by date
  posts.sort(function(a,b) {
    a = a.content.date
    b = b.content.date
    return (a === b) ? 0 : a > b ? -1 : 1;
  })
  return posts.reverse()
}

// prob don't need these any more

function onlyContent(posts) {
  var onlypostcontent = []
  posts.forEach(function(post) {
    onlypostcontent.push(post.content.content)
  })
  return onlypostcontent
}

function sortPosts(posts) {
  posts.sort(function(a,b) {
    a = new Date(a.date)
    b = new Date(b.date)
    return (a === b) ? 0 : a > b ? -1 : 1;
  })
}

// notes: 
// var content = { "content": pagesPosts.pop() }
// doing it this way requires a template with 
// {{#content}}{{content}}{{/content}} but allows you to 
// style between/around posts