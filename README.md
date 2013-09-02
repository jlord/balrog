# Hi!

### Balrog

I'm exercising my mind by making a static site generator just like I want it. There are many ([list](https://gist.github.com/davatron5000/2254924), [list](http://blog.bmannconsulting.com/node-static-site-generators/)) already out there. This isn't to compete, this is just some self sufficency, some weekend JavaScripting fun times. 

#### Basics

- Written in the pure, classic and elegant JavaScript, using [Node.js](http://www.nodejs.org).
- Uses [Handlebars](http://handlebarsjs.com/) for templating.
- No front matter. Ability to leave blog posts in pure markdown format, for easy printing and linking-to/reading/downloading.
 - Post metadata is parsed from the common post headers (below), just make sure your lines coorelate and tags are separated with commas (you can have any varient of markdown header hashes):
 ```markdown
  # Title
  ### Author
  ### Date
  ### Tags
 ```
- Site metadata and template designation happens in `config.json`. You can link files or directories to a template. 

### Structure

- **root** you can put .html or .md files in the root directory. _All .html and .md files will be parsed except for readme.md_.
- **assets** folder to contain subfolders for **css**, **imgs** or **js**. All of its contents are copied directly to the final `site` folder.
- **posts** place your markdown post/blog files here. _No spaces in the filename._
- **shared** contains your template partials/includes such as _header_ or _footer_ HTML files.
- **templates** contains your main template/layout files written in HTML and containing at least `{{content}}` but can also contain partials/includes such as `{{> header}}` which will include a header.html file from the shared folder.
- **node_modules** holds all the nodes. 

#### Other Files

- **config.json** a .JSON file with site meta data in it and template structure. You can link files or directories to a template. 
- **index.html** you'll want at least this. 
- **rss.xml** is generated afresh when you run `node index.js`
- **license, readme.md** docs
- **index.js, meta,js** the main files for executing all this stuff. meta.js generates the metadata and RSS.

#### Future

For now, if you want to host this on [GitHub Pages](http://pages.github.com) you'll have to copy the generated `site` folder into a branch named `gh-pages`. I'm planning on getting it going on Heroku or such and will need to create a little server doodad. 

