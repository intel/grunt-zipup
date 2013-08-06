// wrapper for whichever zip implementation I'm using at the moment
var ZipWriter = require('moxie-zip').ZipWriter;

(function () {
  'use strict';

  var Zip = function (outfile) {
    this.wrapped = new ZipWriter();
    this.outfile = outfile;
  };

  Zip.prototype.addFile = function (src, dest, cb) {
    this.wrapped.addFile(dest, src);
    cb();
  };

  Zip.prototype.writeToFile = function (cb) {
    this.wrapped.saveAs(this.outfile, function () {
      cb();
    });
  };

  module.exports = {
    create: function (outfile) {
      return new Zip(outfile);
    }
  };
})();
