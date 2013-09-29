var fs = require('fs')


module.exports = function(postNames) {
console.log("git these postnames", postNames)
var metaData = []
postNames.forEach(function(name) {
  var uri = 'posts/' + name + '.md'
  fs.readFile(uri, 'utf8', function(err, file) {

    var array = file.toString().split('\n')
    var url = name
    var title = array[0].match(/^(\S+)\s(.*)/).slice(2).toString()
    var author = array[1].match(/^(\S+)\s(.*)/).slice(2).toString()
    var date = array[2].match(/^(\S+)\s(.*)/).slice(2).toString()
    var tags = (array[3].match(/^(\S+)\s(.*)/).slice(2)).toString().split(',')

    var metaObject = {"url": url, "title": title, "author": author, "date": date, "tags": tags}
    metaData.push(metaObject)
    return metaData
  })
})
 
}



