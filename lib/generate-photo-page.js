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
  var images = $('img')
  images.each(function handleImage(i, img) {
    if (img.attribs && img.attribs.alt.match("lead")) return fullWidthImage(img)
    })
}

function fullWidthImage (img){
  // console.log("img", img)
  // var original = $(img).html
  // console.log("orig", original)
  // var closing = '</div>'
  // var opening = '<div class="content-container">'
  // var lead = '<div class="lead-img">'
  // $(img).html(closing + lead + original + closing + opening)
  $(img).before("</div><div class=lead-img>").after("</div><div class=content-container>")
  console.log("new", img)
  return img
}

photosPage()
