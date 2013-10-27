var fs = require('fs')
var cpr = require('cpr')
var mkdirp = require('mkdirp')
var path = require('path')
var minimatch = require('minimatch')

var collect = require('./collect-files')
var generateTemplates = require('./generate-templates')
var feedGenerator = require('./feed-generator')
var parseMarkdown = require('./parse-markdown')

var readFile = fs.readFileSync.bind(fs)
var writeFile = fs.writeFileSync.bind(fs)

var join = path.join.bind(path)

module.exports = function genSiteDir(opts, callback) {
  // opts are:
  //   - source
  //   - output
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
        deleteFirst: true,
      }, function (err, files) {
        if (err) return callback(err)

        var fullPaths = collection.fullPaths()
        var filesAndContent = parseMarkdownFiles(fullPaths, opts)

        var hadError = false

        generateTemplates(opts, function (err, tpl) {
          if (err) return callback(err)

          filesAndContent.forEach(function (page) {
            var template = pickTemplate(page, opts)
            var htmlOutput = tpl.templates[template](page.content)
            writeFile(page.output, htmlOutput)
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
  return file
    .replace(opts.source, opts.output)
    .replace(/.md$/, opts.ext || '.html')
}

function pickTemplate(page, opts) {
  opts = opts || {}
  var defaultTemplate = opts.defaultTemplate || 'main'

  if (!opts.templates)
    return defaultTemplate

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
  return file.replace(opts.source + path.sep, '')
}
