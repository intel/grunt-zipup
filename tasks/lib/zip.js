// wrapper for whichever zip implementation I'm using at the moment
var fs = require('fs');
var archiver = require('archiver');

(function () {
  'use strict';

  var Zip = function (outfile) {
    this.wrapped = archiver('zip');
    var out = fs.createWriteStream(outfile);
    this.wrapped.pipe(out);

    this.wrapped.on('error', function (err) {
      throw err;
    });
  };

  Zip.prototype.addFile = function (src, dest, cb) {
    var buf = fs.readFileSync(src);
    this.wrapped.append(buf, { name: dest }, cb);
  };

  Zip.prototype.writeToFile = function (cb) {
    this.wrapped.finalize(cb);
  };

  module.exports = {
    create: function (outfile) {
      return new Zip(outfile);
    }
  };
})();
