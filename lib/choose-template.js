var minimatch = require('minimatch')
var path = require('path')

var keys = Object.keys

module.exports = function chooseTemplate(relativePath, bindings) {
  return keys(bindings).reduce(function(found, template) {
    if (found)
      return found

    var paths =  bindings[template]

    if (typeof paths == 'string')
      paths = [paths]

    var match = paths.some(function (pathglob) {
      return minimatch(noSlash(relativePath), noSlash(pathglob))
    })

    if (match)
      return template

    return null
  }, null)
}

function noSlash(str) {
  return str.replace(new RegExp('^' + path.sep), '')
}
