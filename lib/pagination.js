var handlebars = require('handlebars')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var cheerio = require('cheerio')

var generateTemplates = require('./generate-templates.js')
var chooseTemplate = require('./choose-template')
var formatHeader = require('./format-header.js')
var createArchive = require('./archive.js')
var buildHome = require('./build-homepage.js')

var writeFile = fs.writeFileSync.bind(fs)

module.exports = function makePages(filesAndContent, opts) { // add back callback
    
  var posts = separatePosts(filesAndContent)
  var totalPosts = posts.length
  var totalPages = Math.ceil(totalPosts / opts.pagination)
  var ppp = ""
  
  if (!opts.partialsDir) {
    ppp = totalPosts
  } else {
    ppp = opts.pagination || 5
  }
  

  generatePages(totalPages, opts, posts)

  function generatePages(totalPages, opts, posts) {

    createArchive(posts, opts)
    buildHome(posts[0], opts)

    posts.forEach(function(post, opts) {
      return formatHeader(post, opts)
    })
      
      generateTemplates(opts, function (err, tpl) {
        if (err) return console.log(err) // callback(err)
              
          for (var i = 0; i < totalPages; i++) {
            
            var pagesPosts = []
            pagesPosts.push(posts.slice((i * ppp), ((i + 1) * ppp)))
            var content = { "posts": pagesPosts.pop(), 
                            "page": i, 
                            "previous": preURL(i), 
                            "next": nextURL(i),
                            "pagination": true 
                          }
            if (ppp > totalPages) content.pagination = false
            var pagePath = determinePage(i)
            var template = chooseTemplate(pagePath, opts.templates) || 'feed'
            var htmlOutput = tpl.templates[template](content)

            if (opts.partialsDir) {
              $ = cheerio.load(htmlOutput)
              if (i === 0) $('a.turn-previous').attr("style", "display: none;").html()
              if (i === (totalPages - 1)) $('a.turn-next').attr("style", "display: none;").html()
              htmlOutput = $.html()
            }
          
            // need to make this outputDir + /blog/
            fs.writeFile(opts.output + '/blog/' + pagePath, htmlOutput, function (err) {
              if (err) throw err
            })
          }
      })
    }

}

function preURL(currentPage){
  if (currentPage === 1) return 'index.html'
  else return (currentPage - 1) + '.html'
}

function nextURL(currentPage){
  return (currentPage + 1) + '.html'
 }

function determinePage(currentPage) {
  var pagePath = ""
  if (currentPage === 0) pagePath = 'index.html'
  else pagePath = currentPage + '.html'
  return pagePath
}

function separatePosts(filesAndContent) {
  var posts = []
  filesAndContent.forEach(function(item) {
    if (item.output.match('/blog/'))
      posts.push(item)
  })
  // sort by date
  var sorted = posts
  sorted.sort(function(a,b) {
    a = a.content.date
    b = b.content.date
    return (a === b) ? 0 : a > b ? -1 : 1;
  })
  return sorted
}

// prob don't need these any more

// function onlyContent(posts) {
//   var onlypostcontent = []
//   posts.forEach(function(post) {
//     onlypostcontent.push(post.content.content)
//   })
//   return onlypostcontent
// }

// function sortPosts(posts) {
//   posts.sort(function(a,b) {
//     // a = new Date(a.date)
//     // b = new Date(b.date)
//     // return (a === b) ? 0 : a > b ? -1 : 1;
//     return a.content.date - b.content.date
//   })
// }

// notes: 
// var content = { "content": pagesPosts.pop() }
// doing it this way requires a template with 
// {{#content}}{{{content}}}{{/content}} but allows you to 
// style between/around posts
// you must tripple {{{}}} to escape the HTML!