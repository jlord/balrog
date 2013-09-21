var test = require('tap').test
var feedGenerator = require('../lib/feed-generator')

var path = require('path')

var f = require('util').format

test('generate the rss feed!', function (t) {
  var site = {
    url: 'http://example.org',
    title: 'My Site',
    description: 'A site for stuff, ya know?',
    imageUrl: 'http://example.org/image.png',
    author: 'brianloveswords',
  }

  var expect = {
    preamble: '<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">',
    title: f('<title><![CDATA[%s]]></title>', site.title),
    desc: f('<description><![CDATA[%s]]></description>', site.description),
    image: f('<image><url>%s</url><title>%s</title><link>%s</link></image>',
            site.imageUrl, site.title, site.url),
    author: f('<author><![CDATA[%s]]></author>', site.author),
    items: [
      '<item><title><![CDATA[Today]]></title><description><![CDATA[Today]]></description><link>http://example.org/blog/today.html</link><guid isPermaLink="true">http://example.org/blog/today.html</guid><dc:creator><![CDATA[brianloveswords]]></dc:creator><pubDate>Invalid Date</pubDate></item>',
      '<item><title><![CDATA[Tomorrow]]></title><description><![CDATA[Tomorrow]]></description><link>http://example.org/blog/tomorrow.html</link><guid isPermaLink="true">http://example.org/blog/tomorrow.html</guid><dc:creator><![CDATA[brianloveswords]]></dc:creator><pubDate>Invalid Date</pubDate></item>',
      '<item><title><![CDATA[Yesterday]]></title><description><![CDATA[Yesterday]]></description><link>http://example.org/blog/yesterday.html</link><guid isPermaLink="true">http://example.org/blog/yesterday.html</guid><dc:creator><![CDATA[brianloveswords]]></dc:creator><pubDate>Invalid Date</pubDate></item>'
    ]
  }

  feedGenerator({
    postsDir: path.join(__dirname, 'test-feedgen'),
    urlPrefix: 'blog',
    site: site
  }, function (err, feed) {

    t.ok(~feed.indexOf(expect.preamble), 'should have preamble')
    t.ok(~feed.indexOf(expect.title), 'should have title')
    t.ok(~feed.indexOf(expect.desc), 'should have desc')
    t.ok(~feed.indexOf(expect.image), 'should have image')
    t.ok(~feed.indexOf(expect.author), 'should have author')

    expect.items.forEach(function (item, i) {
      t.ok(~feed.indexOf(item), 'should have item ' + i)
    })

    t.end()
  })
})
