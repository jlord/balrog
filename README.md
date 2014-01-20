_this is the new readme, it's in progress. it's not all accurate. don't try and follow it :)_

# Hi!

![balrog](balrog.png)
---

_WIP_

A static site generator with these goals:

- Written in the pure, classic and elegant language JavaScript, using [Node.js](http://www.nodejs.org).
- Use [Handlebars](http://handlebarsjs.com/) for templating.
- Pagination, post feed!
- RSS
- **Less mattery front-matter**. Meta data extracted from post headings allowing markdown files to be free from traditional front-matter.


## File Structure

```bash
|_BlogFolder
  |_assets (optional)
    |_css
    |_js
    |_img
  |_partials (optional)
    -header.html
    -footer.html
  |_templates
    -page.html
    -blog.html
    -feed.html
  |_content
    |_blog
      -blog-post.md
      -moar-post.md
    |_about.md
```

## Options

```javascript
opts = {
  source: "./content",
  output: "./site",
  templateDir: "./templates",
  partialsDir: "./partials",
  pagination: 4, 
  templates: {
    blog: 'blog/*',
    about: 'about.md',
    feed: 'page/*'
  },
  feed: {
    postsDir: './content/blog',
    urlPrefix: 'blog',
    site: {
      url: 'http://example.org',
      title: 'My Site',
      description: 'A site for stuff, ya know?',
      imageUrl: 'http://example.org/image.png',
      author: 'meauthor',
    }
  }
}
```

- `source`, `output`, `templateDir` are the locations for the starting content, templates and your build.
- `partialsDir` is optional and is for Handlebars template partials
- `templates` is an object designating what templates to use on what pages. You can list directories or individual files in an array.
- `pagination` is how many posts per page to show on post feed pages. If you don't include this, it defaults to 5.
- `feed` is not optional, you must provide this information for generating the RSS

## To Build

### Install Balrog

- `npm install -g balrog`
_(not yet on NPM, but it will be in the future)_

### Build Your Content

- set up file structure as described above
- create config.JSON

#### A note on Templates/Blog Feed

When creating a blog feed page template (the one that shows x (pagination number) of posts per page), your template must look like this:

```HTML
{{#posts}}
  {{{content.content}}}
{{/posts}}
```

#### Posts, Meta Data

Meta data is generated through the first 4 lines of each blog post. It doesn't matter how you style them, so long as your first 4 lines are in this order:

```markdown
# Title
### Author
#### Date
##### Tags, tags, tags

Hi this is a post. So pancake.
```

**TO DO** An extension to not do this if you wish not to.

#### Pages

Create general non-blog pages

- Site metadata and template designation happens in `config.json`. You can link files or directories to a template.

### Build!

- `balrog`

#### Build & Serve Locally

- `balrog -serve`

**There needs to be a serve only option**

#### Future

For now, if you want to host this on [GitHub Pages](http://pages.github.com) you'll have to copy the generated `site` folder into a branch named `gh-pages`. I'm planning on getting it going on Heroku or such and will need to create a little server doodad. I'll also probably generate some JSON for all the post data so that I can do other nifty stuff with it.
