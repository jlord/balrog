const glob = require('glob');
const path = require('path');

module.exports = function collectFiles(directory, callback) {
  glob(directory + '/**', function (err, files) {
    if (err)
      return callback(err)

    return callback(null, {
      prefix: directory,
      files: files.map(function (file) {
        return file.replace(directory, '')
      }).filter(function (file) {
        return file != ''
      }),
      fullPaths: function fullPaths() {
        return this.files.map(function (file) {
          return path.join(this.prefix, file)
        }.bind(this))
      }
    })
  })
}
