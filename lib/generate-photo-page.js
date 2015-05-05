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
      while(target.parent().length && target.parent().attr("class") != "post-body") { target = target.parent() }
      var imgs = [$(img), $(img).siblings().map(function(i, img) { if (img.name == "img") {return img} })].join("")
      target.replaceWith("<div class=lead-img>" +  imgs  + "</div>")
    }
  })

  return $.html()
}

console.log(photosPage())
