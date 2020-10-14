var fs = require('fs');

var files = fs.readdirSync(__dirname);

var ignored = ['index.js', 'package.json', 'package-lock.json', '.git', '.gitignore', 'test', 'node_modules', 'backups'];

files.forEach(function (name) {
  if (ignored.indexOf(name) !== -1) {
    return;
  }

  module.exports[name] = require('./' + name);
});
