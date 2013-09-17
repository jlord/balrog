var fs = require('fs')
var cpr = require('cpr')
var mkdirp = require('mkdirp')
var path = require('path')
var collect = require('./collect-files')
var generateTemplates = require('./generate-templates')
var parseMarkdown = require('./parse-markdown')

var readFile = fs.readFileSync.bind(fs)
var writeFile = fs.writeFileSync.bind(fs)

var join = path.join.bind(path)

var SOURCE_DIR = join(__dirname, 'content')
var OUTPUT_DIR = join(__dirname, 'site')

module.exports = function genSiteDir(options, callback) {
  options = options || {}

  var sourceDir = options.source || SOURCE_DIR
  var outputDir = options.output || OUTPUT_DIR
  var defaultTemplate = options.defaultTemplate || 'main'

  // TODO: we can avoid this callback chain. `collect`, `mkdirp` and
  // `generateTemplates` can all be run concurrently.
  mkdirp(outputDir, function (err) {
    if (err) return callback(err)

    collect(sourceDir, function (err, collection) {

      cpr(sourceDir, outputDir, {
        deleteFirst: true,
      }, function (err, files) {
        if (err) return callback(err)

        var fullPaths = collection.fullPaths()
        var filesAndContent = parseMarkdownFiles(fullPaths, options)

        generateTemplates(options, function (err, tpl) {
          if (err) return callback(err)

          filesAndContent.forEach(function (post) {
            var htmlOutput = tpl.templates[defaultTemplate](post.content)
            writeFile(post.filename, htmlOutput)
          })

          return collect(outputDir, callback)
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
    return { filename: toHtml(file, opts), content: content }
  })
}

function toHtml(file, opts) {
  opts = opts || {}
  return file
    .replace(opts.source, opts.output)
    .replace(/.md$/, opts.ext || '.html')
}
