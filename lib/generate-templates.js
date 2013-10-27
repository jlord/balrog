var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars')
var collect = require('./collect-files')

var join = path.join.bind(path)

var TEMPLATES_DIR = path.join(__dirname, '..', 'templates')
var PARTIALS_DIR = path.join(__dirname, '..', 'partials')

module.exports = function makeTemplates(options, callback) {
  options = options || {}

  var templateDir = options.templateDir || TEMPLATES_DIR
  var partialsDir = options.partialDir || PARTIALS_DIR

  var waiting = 2
  var hadError = false
  var results = {}

  collect(templateDir, done('templates'))
  collect(partialsDir, done('partials'))

  function done(name) {
    return function reallyDone(err, collection) {
      if (hadError) return;

      if (err) {
        hadError = true
        callback(err)
      }

      results[name] = collection;
      if (--waiting == false)
        return continuing(results)
    }
  }

  function continuing(results) {
    registerPartials(results.partials)

    callback(null, {
      handlebars: handlebars,
      templates: makeTemplateFunctions(results.templates)
    });
  }
}

function registerPartials(collection) {
  return collection.files
    .map(makeArgs)
    .forEach(register)

  function makeArgs(file) {
    return [ file.replace(/\..*$/, ''),
             readFile(join(collection.prefix, file)) ]
  }

  function register(args) {
    handlebars.registerPartial.apply(handlebars, args);
  }
}

function makeTemplateFunctions(collection) {
  return collection.files.reduce(function (results, file) {
    var name = file.replace(/\..*$/, '')
    var content = readFile(join(collection.prefix, file))
    results[name] = handlebars.compile(content);
    return results;
  }, {})
}

function readFile(file) {
  return fs.readFileSync(file).toString('utf-8');
}
