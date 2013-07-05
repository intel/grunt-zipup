#!/bin/bash

# This script generates a widget package k9.wgt inside
# the root directory of this project.

FILE_NAME=$1

if [[ "x" = "x$FILE_NAME" ]] ; then
  echo "Usage: $0 <wgt file name>"
  exit 1
fi

if [[ -f $FILE_NAME ]] ; then
  rm $FILE_NAME
fi

zip -r $FILE_NAME icon.png index.html config.xml test.js

