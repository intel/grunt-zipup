/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// run glob on pattern and filter returned entries
//
// {Function} filter Function with signature filter(entry), which
// should return null (to filter the entry out) or the entry
// (either modified or unmodified);
// if filter is not supplied, this behaves the same as glob
// {Function} cb Should have signature cb(err, result)
var glob = require('glob');

module.exports = function (pattern, filter, cb) {
  if (arguments.length === 2) {
    glob(pattern, filter);
    return;
  }

  glob(pattern, function (err, results) {
    if (err) {
      cb(err);
      return;
    }

    var filteredResults = [];
    var filteredResult;

    for (var i = 0; i < results.length; i++) {
      filteredResult = filter(results[i]);

      if (filteredResult) {
        filteredResults.push(filteredResult);
      }
    }

    cb(null, filteredResults);
  });
};
