/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
require('chai').should();
var testZipfile = require('./zip_file_test.helper');

// this test is setup by the zipup:tizen_tiny_app_wgt task
// (see ../Gruntfile.js)
describe('zipup:tizen_tiny_app_wgt', function () {
  it('should correctly pack files into the zip file', function (done) {
    testZipfile(
      {
        zipfileGlob: 'build/tizen-tiny-app_0.1.0_*.wgt',
        zipfilenameRegex: /tizen-tiny-app_0.1.0_\d{4}-\d{2}-\d{2}_\d{6}\.wgt/,
        expectedFilesGlob: 'test/fixtures/tizen-tiny-app/**',
        expectedFilesStripPrefix: 'test/fixtures/',
        zipfileExtractDir: 'build/tizen-tiny-app-unzipped'
      },
      done
    );
  });
});
