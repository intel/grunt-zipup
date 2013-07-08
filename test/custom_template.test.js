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

// this test is setup by the zipup:custom_template task
// (see ../Gruntfile.js)
describe('zipup:custom_template', function () {
  it('should correctly pack files into the zip file', function (done) {
    testZipfile(
      {
        zipfileGlob: 'build/custom-template_0.5.0_*.zip',
        zipfilenameRegex: /custom-template_0.5.0_\d{6}_git@[a-z0-9]{7}_QA\.zip/,
        expectedFilesGlob: 'test/fixtures/specific-files/**',
        expectedFilesStripPrefix: ''
      },
      done
    );
  });
});
