var marked = require('marked')
var renderer = new marked.Renderer()

module.exports = function parser(contents) {
  var result = extractMetaMatter(contents)
  var content = removeHeaders(contents)

  renderer.image = function (href, title, text) {
    var img
    var linkedImg
    var captionText
    var caption

    if (text.match('full-img')) {
      captionText = text.replace('full-img', '')
      caption = '<em class="caption meta">' + captionText + '</em>'
      img = '<img class="full-img" src="' + href + '">'
      linkedImg = '<a style="border: none;" href="' + href + '" target="_blank">' + img + '</a>'
      return '</div>' + linkedImg + '<div class="wrapper">' + caption
    } else return '<img src="' + href + '" alt="' + text + '">'
  }
  result.content = marked(content.toString('utf-8'), { renderer: renderer })
  return result
}

function getMetaLines(contents) {
  var lines = contents.toString('utf-8').split('\n')
  var end = 4

  for (var i = 0; i < 4; i++) {
    if (lines[i] === "") {
      end = i
    }
  }
  return lines.slice(0, end)
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
  // the headers are the first lines of the
  // document with # until the first ''
  // so see where that '' occurs to know
  // when to cut for the body

  var cut = 4
  for (var i = 0; i < 4; i++) {
    if (lines[i] === "") {
      cut = i
    }
  }

  var headers = lines.filter(onlyHeaders)
  // console.log(lines, cut, lines.length)
  // console.log(lines.splice(cut, lines.length).join('\n'))
  return lines.splice(cut, lines.length).join('\n')
}
