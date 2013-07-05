require('chai').should();
var glob = require('glob');

// this test is setup by the zipup:tizen_tiny_app_wgt task
// (see ../Gruntfile.js)
describe('zipup:tizen_tiny_app_wgt', function () {
  it('it should produce a zip file with expected name', function (done) {
    // expected filename will look like
    // tizen-tiny-app_0.1.0_2013-07-05_114733.wgt
    glob('build/tizen-tiny-app_0.1.0_*.wgt', function (err, files) {
      files.length.should.equal(1);

      // check that the filename contains a date-like pattern
      var expected = /tizen-tiny-app_0.1.0_\d{4}-\d{2}-\d{2}_\d{6}\.wgt/;
      files[0].should.match(expected);

      done();
    });
  });

  it('should correctly pack files into the zip file', function (done) {
    done();
  });
});
