var handlebars = require('handlebars')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')

var generateTemplates = require('./generate-templates.js')
var chooseTemplate = require('./choose-template')

var writeFile = fs.writeFileSync.bind(fs)

module.exports = function makePages(filesAndContent, opts) {
  // add back callback
  // remove non-posts from array
  var posts = separatePosts(filesAndContent)
  // var postContent = onlyContent(posts)
  // console.log("content", postContent)
  var totalPosts = posts.length
  var totalPages = Math.ceil(totalPosts / opts.pagination)
  var pagination = opts.pagination || 5
  // var pages = getPages(totalPosts, pagination, posts)
  generatePages(totalPages, opts, posts)

  // sort by date
  // var sorted = sortPosts(posts)


  function onlyContent(posts) {
    var onlypostcontent = []
    posts.forEach(function(post) {
      onlypostcontent.push(post.content.content)
    })
    return onlypostcontent
  }
  
//   generateTemplates(opts, function (err, tpl) {
//     if (err) return console.log(err) // callback(err)
// 
//     filesAndContent.forEach(function (page) {
//       var pagePath = removeDirPrefix(page.input, opts)
//       console.log("PAGEPATH", pagePath)
//       var template = chooseTemplate(pagePath, opts.templates) || 'main'
//       var htmlOutput = tpl.templates[template](page.content)
//       writeFile(page.output, htmlOutput)
//     })
//   })
// }

  function sortPosts(posts) {
    posts.sort(function(a,b) {
      a = new Date(a.date)
      b = new Date(b.date)
      return (a === b) ? 0 : a > b ? -1 : 1;
    })
  }

  function getPages(totalPosts, pagination, posts){
    var pages = []
    for (var i = 0; i <= totalPosts.length; i += pagination) {
      console.log("hi")
      pages.push(posts.slice(i, i + pagination))
    }
    return pages
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

  function generatePages(totalPages, opts, posts) {
    console.log("total pages ", totalPages)
    console.log('posts', posts.length)
    var ppp = opts.pagination
    console.log('pagination', ppp)
    
    generateTemplates(opts, function (err, tpl) {
      if (err) return console.log(err) // callback(err)
      
      mkdirp('site/blog/page/', function() {
        
        for (var i = 0; i < totalPages; i++) {
          var pagesPosts = []
          pagesPosts.push(posts.slice((i * ppp), ((i + 1) * ppp)))
          console.log( "slicing", (i * ppp), ((i + 1) * ppp))
          var content = { "content": pagesPosts.pop() }
          var pagePath = 'page/' + i + '.html'
          var template = chooseTemplate(pagePath, opts.templates) || 'main'
          var htmlOutput = tpl.templates[template](content)
          console.log("htmlOutput", htmlOutput)
          fs.writeFile('site/blog/' + pagePath, htmlOutput, function (err) {
            if (err) throw err
          })
        } // for loop
      }) // mkdirp cb
    }) // gentemp cb
  } // genpages

}
    
// function removeDirPrefix(file, opts) {
//   return file.replace(opts.source + path.sep, '')
// }
// [ { input: '/Users/jessicalord/jCode/modules/myblogz/content/blog/first-post.md',
//     output: '/Users/jessicalord/jCode/modules/myblogz/site/blog/first-post.html',
//     content:
//      { title: 'Hello First Post',
//        author: 'By Balrog',
//        date: 'Jan 2013',
//        tags: [Object],
//        content: '<h1>Hello First Post</h1>\n<h2>By Balrog</h2>\n<h2>Jan 2013</h2>\n<h2>test</h2>\n<p>I love bloggin.</p>\n' } } ]
