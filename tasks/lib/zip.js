// wrapper for whichever zip implementation I'm using at the moment
var fs = require('fs');
var archiver = require('archiver');

(function () {
  'use strict';

  var Zip = function () {
    this.wrapped = archiver('zip');

    this.wrapped.on('error', function (err) {
      throw err;
    });
  };

  Zip.prototype.addFile = function (src, dest) {
    this.wrapped.append(fs.readFileSync(src), { name: dest });
  };

  Zip.prototype.writeToFile = function (path, cb) {
    var out = fs.createWriteStream(path);
    this.wrapped.pipe(out);
    this.wrapped.finalize(cb);
  };

  module.exports = {
    create: function () {
      return new Zip();
    }
  };
})();
