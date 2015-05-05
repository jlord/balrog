var fs = require('fs')
var cpr = require('cpr')
var mkdirp = require('mkdirp')
var path = require('path')
var glob = require('glob')

var collect = require('./collect-files')
var generateTemplates = require('./generate-templates')
var feedGenerator = require('./feed-generator')
var parseMarkdown = require('./parse-markdown')
var chooseTemplate = require('./choose-template')
var makePage = require('./pagination.js')
var formatHeader = require('./format-header.js')
var photosPage = require('./generate-photo-page.js')

var readFile = fs.readFileSync.bind(fs)
var writeFile = fs.writeFileSync.bind(fs)

var join = path.join.bind(path)

module.exports = function genSiteDir(opts, callback) {
  // opts are:
  //   - source
  //   - output
  //   - pagination
  //   - templates
  //   - templateDir (for `generateTemplates`)
  //   - partialsDir (for `generateTemplates`)
  //   - feed (for `feedGenerator`)

  opts = opts || {}
  var err;

  var sourceDir = opts.source
  var outputDir = opts.output

  if (!sourceDir) {
    err = new Error('You must pass a path for the `source` option.')
    err.code = 'E_NO_SOURCE'
    return callback(err)
  }

  if (!outputDir) {
    err = new Error('You must pass a path for the `output` option.')
    err.code = 'E_NO_OUTPUT'
    return callback(err)
  }

  // TODO: this is a gross callback chain.
  mkdirp(outputDir, function (err) {
    if (err) return callback(err)

    collect(sourceDir, function (err, collection) {
      cpr(sourceDir, outputDir, {
        deleteFirst: false,
        overwrite: false,
        confirm: true
      }, function (err, files) {
        if (err) return callback(err)

        var fullPaths = collection.fullPaths()
        var filesAndContent = parseMarkdownFiles(fullPaths, opts)
        makePage(filesAndContent, opts) // make blog feed pages

        var hadError = false

        generateTemplates(opts, function (err, tpl) {
          if (err) return callback(err)


          // handle non .md Pages
          // duplicating this action, yolo
          // fullPaths.forEach(function(path) {
          //   if (path.match('.html')) {
          //     console.log("PATH", path)
          //     var pagePath = removeDirPrefix(path, opts)
          //     var template = chooseTemplate(pagePath, opts.templates) || 'main'
          //     var content = readFile(path).toString('utf-8')
          //     console.log('content', content)
          //     console.log('template', template)
          //     var htmlOutput = tpl.templates[template](content)
          //     console.log(htmlOutput)
          //     writeFile('site/' + pagePath , htmlOutput)
          //   }
          // })

          filesAndContent.forEach(function (page) {
            var pagePath = removeDirPrefix(page.input, opts)
            var template = chooseTemplate(pagePath, opts.templates) || 'main'
            if (!pagePath.match("blog")) page = formatHeader(page, opts)
            var htmlOutput = tpl.templates[template](page.content)
            //
            // at this point check to see if it is a photo-page
            // using post tags, open to other ideas
            if (page.content.tags && page.content.tags[0]  === "photos") {
              console.log("PHOTOS PAGE!")
              photosPage(page, opts)
            }
            writeFile(page.output, htmlOutput)
          })

          mkdirp('./site/blog/markdown', function(err) {
            glob("./site/blog/*.md", {nomount: true}, function(err, files) {
              var filenames = files.map(function(name) {
                 return path.basename(name)
              })
              filenames.forEach(function(file) {
                fs.renameSync('./site/blog/' + file, './site/blog/markdown/' + file)
              })
            })
          })

          feedGenerator(opts.feed, function (err, feed) {
            if (err) return callback(err)

            // TODO: don't hardcode 'rss.xml'
            var filePath = path.join(outputDir, 'rss.xml')
            writeFile(filePath, feed)
            return collect(outputDir, callback)
          })
        })
      })
    })
  })
}

function parseMarkdownFiles(files, opts) {
  opts = opts || {}
  return files.filter(function (file) {
    return /\.md$/.test(file)
  }).map(function (file) {
    var content = parseMarkdown(readFile(file))
    return {
      input: file,
      output: toHtml(file, opts),
      content: content
    }
  })
}

function toHtml(file, opts) {
  opts = opts || {}
  return (file
    .replace(opts.source, opts.output)
    .replace(/.md$/, opts.ext || '.html'))
}

function removeDirPrefix(file, opts) {
  return file.replace(opts.source + path.sep, '')
}
