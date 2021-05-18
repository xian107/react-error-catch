#!/bin/bash

# app version
version="0.0.1"
app="react-error-catch"

echo "Hi"

function build() {
  echo ">> The current version of $app is $version"
  cp index.js lib/index.js
  cp index.d.ts lib/index.d.ts
}


if [ "$1" == "" ]; then
  help
elif [ "$1" == "build" ]; then
  build
else
  help
fi