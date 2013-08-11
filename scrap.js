function makePage (environment, subDir, num ) {
    // Markdown
    var raw         = fs.readFileSync(__dirname + subDir + num + '.md').toString();  
    var content     = marked(raw);  

    // Handlebars
    var source      = fs.readFileSync(__dirname + '/static/index.html').toString();
    var template    = handlebars.compile(source);

    // Compose and return
    var provider    = _.extend(environment, {
        content: content
    });
    return template(provider);
}

fs.writeFile('message.txt', 'Hello Node', function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});