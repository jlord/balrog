var marked = require('marked')

module.exports = function parser(contents) {
  return {
    meta: extractMetaMatter(contents),
    body: marked(contents.toString('utf-8')),
  }
}

function extractMetaMatter(contents) {
  var lines = contents.toString('utf-8').split('\n')
  var meta = lines.slice(0, 4).map(stripHashes);
  return {
    title: meta[0],
    author: meta[1],
    date: meta[2],
    tags: meta[3] && meta[3].split(/,\s*/),
  }
}

function stripHashes(string) {
  return string.replace(/#+\s/, '');
}
