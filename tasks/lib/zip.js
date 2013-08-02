// wrapper for whichever zip implementation I'm using at the moment
var NodeZip = require('node-zip');
var fs = require('fs');

(function () {
  'use strict';

  var Zip = function () {
    this.wrapped = new NodeZip();
  };

  Zip.prototype.addFile = function (src, dest) {
    this.wrapped.file(dest, fs.readFileSync(src, 'binary'));
  };

  Zip.prototype.writeToFile = function (path) {
    var data = this.wrapped.generate({base64: false, compression: 'DEFLATE'});
    fs.writeFileSync(path, data, 'binary');
  };

  module.exports = {
    create: function () {
      return new Zip();
    }
  };
})();
