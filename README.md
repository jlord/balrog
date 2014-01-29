_this is the new readme, it's in progress. it's not all accurate. don't try and follow it :)_

# Hi!

![balrog](https://raw2.github.com/jlord/balrog/master/balrog.png)
---

_WIP_

A static site generator with these goals:

- Written in the pure, classic and elegant language **JavaScript**, using [Node.js](http://www.nodejs.org).
- Use [**Handlebars**](http://handlebarsjs.com/) for templating.
- Includes **paginated post feed**!
- RSS
- **Less mattery front-matter**. Meta data extracted from post headings allowing markdown files to be free from traditional front-matter.


## File Structure

```bash
|_BlogFolder
  |_partials (required)
    -pagination.html (required)
    -header.html
    -footer.html
  |_templates
    -page.html
    -blog.html
    -feed.html
  |_content (required)
    |_assets (optional)
      |_css
      |_js
      |_img
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

1. Requires [Node.js](http://www.nodejs.org/download) and [NPM](http://www.npmjs.org) (which comes with .pkg and .msi downloads of Node.js)
2. You'll install the `balrog` module globally, then run it from the command line within a directory set up in the style diagramed above.

### Install Balrog

```bash
npm install -g balrog
```

### Build Your Content

1. Set up file structure as described above
 - You can copy the base files from the [template branch](#) 
2. Create `config.JSON`
3. Make sure you include and use the following as described:

#### Blog Feed Template

When creating a blog feed page template (the one that shows x (pagination number) of posts per page), your template must look like this:

```HTML
{{#posts}}
  {{{content.content}}}
{{/posts}}
{{> pagination}}
```

#### Pagination Template

The "Previous/Next" links are added to the bottom of blog feeds via a Handlebars Partial template:

```bash
<div class="turn-page">
  <a class="turn-previous" href="{{previous}}">Previous</a>
  <a class="turn-next" href="{{next}}">Next</a>
</div>
```

Additionally, the class `end-of-pages` is applied when there is not a previous or next page. _If you do not include a partials directory, it will default to generating 1 blog post feed page with all posts._

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

Create general non-blog pages (such as an About page) by placing the .md file in the ``/contents`` directory. You can assign it a template in the `config.json`


### Build!

From within your soon-to-be Balrog'd directory, run:

- `balrog`

#### Build & Serve Locally

Serve up the site locally on a random port:

- `balrog -serve`

#### Host on GitHub Pages

Create a new repository on GitHub and place all the contents of your Balrog generated `/site` directory on a branch named `gh-pages`. Bam, website! You can find it at: yourgithubname.github.io/reponame
