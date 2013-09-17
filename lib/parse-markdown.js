var marked = require('marked')

module.exports = function parser(contents) {
  var result = extractMetaMatter(contents)
  result.content = marked(contents.toString('utf-8'));
  return result
}

function extractMetaMatter(contents) {
  var lines = contents.toString('utf-8').split('\n')
  var meta = lines.slice(0, 4)
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
