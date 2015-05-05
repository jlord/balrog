#!/usr/bin/env node

// This should pull out each of the images from the testcontent
// and then wrap them in closing and opening divs so that they are in their own
// div, not the 'content-container' div, so that they can be larger.
//
//
var fs =  require('fs')
var cheerio = require('cheerio')

var testcontent = fs.readFileSync('./lib/testcontent.html')
var $ = cheerio.load(testcontent)

function photosPage () {
  var h = $.html()
  var images = $('img')
  images.each(function handleImage(i, img) {
    if ($(img).attr("alt").match("lead")) {
      var target = $(img)
      while(target.parent().attr("class") != "post-body") { target = target.parent() }
      target.replaceWith("<div class=lead-img>" +  $(img)  + "</div>")
    }
  })

  return $.html()
}

console.log(photosPage())
