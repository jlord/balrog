# Hi!

### Bahl

I'm exercising my mind by making a static site generator just like I want it. There are many ([list](https://gist.github.com/davatron5000/2254924), [list](http://blog.bmannconsulting.com/node-static-site-generators/)) already out there. This isn't to compete, this is just some self sufficency, some weekend JavaScripting fun times. 

If you're still interested, here are my aims (aka what I want from a static site generator):

- Written in pure JavaScript, using [Node.js](http://www.nodejs.org).
- Uses [Handlebars](http://handlebarsjs.com/) for templating.
- No front matter. Ability to leave blog posts in pure markdown format, for easy printing and linking-to/reading elsewhere.
 - Metadata to come from a config.json
- Ummm

_The name comes from @maxogden's middle names which I mess up the order on when I read his IRC nick, mbalho, as "ma-bahl-o". Also, I didn't try very hard to name this._

#### Notes

- All template partials are called in other template files, not in the source .md or .html files
- Templates are specified in the config.json file, you can specifify individual files or directories