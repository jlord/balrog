module.exports = function formatHeader(page, opts) {
  var url = pageURL(page.output)

  var title = "<a href='" + url + "'><h1>" + page.content.title + "</h1></a>"
  var metaList = buildMeta(page).join(" ")
  var meta = "<ul>" + metaList + "</ul>"

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

function buildMeta(page) {
  var meta = []
  if (page.content.author) {
    meta.push("<li>" + page.content.author + "</li>")
  }
  if (page.content.date) {
    meta.push("<li>" + page.content.date + "</li>")
  }
  if (page.content.tags) {
    meta.push("<li>" + page.content.tags +"</li>")
  }
  return meta
}
