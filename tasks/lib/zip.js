// wrapper for whichever zip implementation I'm using at the moment
var AdmZip = require('adm-zip');

(function () {
  'use strict';

  var Zip = function () {
    this.wrapped = new AdmZip();
  };

  Zip.prototype.addFile = function (path, buffer) {
    this.wrapped.addFile(path, buffer);
  };

  Zip.prototype.writeToFile = function (path) {
    this.wrapped.writeZip(path);
  };

  module.exports = {
    create: function () {
      return new Zip();
    }
  };
})();
