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

// this test is setup by the zipup:custom_dest task
// (see ../Gruntfile.js)
describe('zipup:custom_dest', function () {
  it('should correctly pack files into the zip file', function (done) {
    testZipfile(
      {
        zipfileGlob: 'build/custom-dest_0.4.0_*.zip',
        zipfilenameRegex: /custom-dest_0.4.0_\d{4}-\d{2}-\d{2}_\d{6}\.zip/,
        expectedFiles: [
          'custom_dest_app/lib/test1.js',
          'custom_dest_app/lib/test2.js',
          'custom_dest_app/src/test3.js',
          'custom_dest_app/src/test4.js'
        ]
      },
      done
    );
  });
});
