require('chai').should();
var AdmZip = require('adm-zip');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var fileHelper = require('./file.helper');

// this test is setup by the zipup:tizen_tiny_app_wgt task
// (see ../Gruntfile.js)
describe('zipup:tizen_tiny_app_wgt', function () {
  it('should produce a zip file with expected name', function (done) {
    // expected filename will look like
    // tizen-tiny-app_0.1.0_2013-07-05_114733.wgt
    fileHelper('build/tizen-tiny-app_0.1.0_*.wgt', function (err, files) {
      files.length.should.equal(1);

      // check that the filename contains a date-like pattern
      var expected = /tizen-tiny-app_0.1.0_\d{4}-\d{2}-\d{2}_\d{6}\.wgt/;
      files[0].should.match(expected);

      done();
    });
  });

  it('should correctly pack files into the zip file', function (done) {
    // get the entries in the zipfile
    var getZipfileEntries = function (asyncCb) {
      fileHelper('build/tizen-tiny-app_0.1.0_*.wgt', function (err, result) {
        if (err) {
          asyncCb(err);
        }
        else {
          result.length.should.equal(1);

          var zipfile = new AdmZip(result[0]);

          var entries = _.map(zipfile.getEntries(), function (entry) {
            return entry.entryName;
          });

          asyncCb(null, entries);
        }
      });
    };

    // get the array of expected filenames
    var getExpectedFilenames = function (asyncCb) {
      fileHelper(
        'test/fixtures/tizen-tiny-app/**',

        // filter which returns only files, with the "test/fixtures"
        // prefix removed
        function (filename) {
          if (fs.statSync(filename).isFile()) {
            return filename.replace('test/fixtures', '');
          }
          else {
            return null;
          };
        },

        asyncCb
      );
    };

    // get the file lists in parallel and compare them
    async.parallel(
      {
        actual: getZipfileEntries,
        expected: getExpectedFilenames
      },

      function (err, result) {
        if (err) {
          done(err);
        }
        else {
          result.actual.should.have.members(result.expected);
          result.actual.length.should.equal(result.expected.length);
          done();
        }
      }
    );
  });
});
