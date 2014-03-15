var marked = require('marked')

module.exports = function parser(contents) {
  var result = extractMetaMatter(contents)
  html = marked(contents.toString('utf-8'));
  result.content = wrapHeaders(html)
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

function wrapHeaders(contents) {
  var lines = contents.toString('utf-8').split('\n')  
  console.log(["LLINES", lines])
  ammendedContent = '<div class="post-header">' + lines.splice(0,4).join('') 
    + "</div>" + lines.join('')
  return ammendedContent
  // var close = "</div>"
  // return string = open + string + close
}
