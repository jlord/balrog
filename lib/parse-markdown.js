var marked = require('marked')

module.exports = function parser(contents) {
  var result = extractMetaMatter(contents)
  var content = removeHeaders(contents)
  result.content = marked(content.toString('utf-8'))
  return result
}

function getMetaLines(contents) {
  var lines = contents.toString('utf-8').split('\n')
  return lines.slice(0, 4)
}

function extractMetaMatter(contents) {
  var meta = getMetaLines(contents)
    .filter(onlyHeaders)
    .map(stripHeaders)

  return {
    title: meta[0],
    author: meta[1],
    date: meta[2],
    tags: meta[3] && meta[3].split(/,\s*/),
  }
}

function onlyHeaders(string) {
  return /\s*#+\s/.test(string)
}

function stripHeaders(string) {
  return string.replace(/\s*#+\s/, '');
}

function removeHeaders(contents) {
  var lines = contents.toString('utf-8').split('\n') 
  var headers = lines.filter(onlyHeaders)
  return lines.splice(headers.length, lines.length).join('\n')
}

