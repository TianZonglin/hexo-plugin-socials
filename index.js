/* global hexo */
'use strict';
var fs = require('hexo-fs');
var path = require('path');
var log = require('hexo-log')({
  debug: false,
  silent: false
});

 

hexo.extend.generator.register('psocials', function (locals) {
  if (!this.config.socials || !this.config.socials.builtin) {
    return;
  }
  return require('./lib/psocials-generator').call(this, locals);
});

 

var options = {
  options: [
    { name: '-b, --books', desc: 'Generate socials books only' },
    { name: '-m, --movies', desc: 'Generate socials movies only' },
    { name: '-g, --games', desc: 'Generate socials games only' }
  ]
};

hexo.extend.console.register('usocial', 'Generate pages from socials', options, function (args) {

  var names = [];

  if (args.b || args.books) {
    names.push("books");
  }
  if (args.m || args.movies) {
    names.push("psocials");
  }

  if (args.g || args.games) {
    names.push("games");
  }
  if (names.length === 0) {
    names.push("psocials");
  }

  //var doubanLoadingPath = '/assets/douban-loading.gif';
  //Load static files
  //hexo.extend.generator.register('psocials-gif', function (locals) {
  //  return {
  //    path: doubanLoadingPath,
  //    data: function () {
  //      return fs.createReadStream(path.join(__dirname, '/lib/templates/psocials-loading.gif'));
  //    }
  //  };
  //});

  //Register route
  names.forEach(name => {
    hexo.extend.generator.register(name, require('./lib/' + name + '-generator'));
  })

  var self = this;
  var publicDir = self.public_dir;

  //Generate files
  self.load().then(function () {
    if(!fs.existsSync(publicDir)){
      fs.mkdirSync(publicDir);
    }
    if(!fs.existsSync(path.join(publicDir,'assets'))){
      fs.mkdirSync(path.join(publicDir,'assets'));
    }
    self.route.get(doubanLoadingPath)._data().then(function (stream) {
      stream.pipe(fs.createWriteStream(path.join(publicDir, doubanLoadingPath)));
    });
    names.forEach(name => {
      var id = name + "/index.html"; 
      self.route.get(id) && self.route.get(id)._data().then(function (contents) {
        fs.writeFile(path.join(publicDir, id), contents);
        log.info("Generated: %s", id);
      });
    });
  });
});
