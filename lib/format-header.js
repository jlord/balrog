module.exports = function formatHeader(page, opts) {
  var url = pageURL(page.output)

  var title = "<a href='" + url + "'><h1>" + page.content.title + "</h1></a>"
  var meta = "<ul><li>" + page.content.author + "</li>"
    + "<li>" + page.content.date + "</li>"
    + "<li>" + page.content.title +"</li></ul>"

  var header = "<div class='post-header'>"
    + title + meta + "</div>"

  var newContent = header + page.content.content
  page.content.content = newContent

  return (page)
}

function pageURL(pageDir) {
  var parts = pageDir.split('/')
  var url = parts.pop()
  console.log("LOG", parts, parts.length, parts.pop())
  return url
}

