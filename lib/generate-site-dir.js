var fs = require('fs')
var cpr = require('cpr')
var mkdirp = require('mkdirp')
var path = require('path')
var minimatch = require('minimatch')

var collect = require('./collect-files')
var generateTemplates = require('./generate-templates')
var parseMarkdown = require('./parse-markdown')

var readFile = fs.readFileSync.bind(fs)
var writeFile = fs.writeFileSync.bind(fs)

var join = path.join.bind(path)

var SOURCE_DIR = join(__dirname, 'content')
var OUTPUT_DIR = join(__dirname, 'site')

module.exports = function genSiteDir(opts, callback) {
  opts = opts || {}

  var sourceDir = opts.source || SOURCE_DIR
  var outputDir = opts.output || OUTPUT_DIR

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
        var filesAndContent = parseMarkdownFiles(fullPaths, opts)

        generateTemplates(opts, function (err, tpl) {
          if (err) return callback(err)

          filesAndContent.forEach(function (page) {
            var template = pickTemplate(page, opts)
            var htmlOutput = tpl.templates[template](page.content)
            writeFile(page.output, htmlOutput)
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
    return {
      input: file,
      output: toHtml(file, opts),
      content: content
    }
  })
}

function toHtml(file, opts) {
  opts = opts || {}
  return file
    .replace(opts.source, opts.output)
    .replace(/.md$/, opts.ext || '.html')
}

function pickTemplate(page, opts) {
  opts = opts || {}
  var defaultTemplate = opts.defaultTemplate || 'main'

  var templates = Object.keys(opts.templates)
    .map(function (name) {
      return { name: name, pattern: opts.templates[name] }
    })

  return templates.reduce(function (found, tpl) {
    if (found) return found
    var relativePath = removeDirPrefix(page.input, opts)
    if (minimatch(relativePath, tpl.pattern))
        return tpl.name
  }, null) || defaultTemplate
}

function removeDirPrefix(file, opts) {
  console.log('file;', file, '\nsource:', opts.source)
  return file.replace(opts.source + '/', '')
}
