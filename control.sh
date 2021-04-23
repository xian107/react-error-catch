#!/bin/bash

# app version
version="0.0.1"
app="react-error-catch"

echo "hello"

function build() {
  echo ">> The current version of $app is $version"
  cp index.js npm/index.js
  cp index.d.ts npm/index.d.ts
  cp README.md npm/README.md
}


if [ "$1" == "" ]; then
  help
elif [ "$1" == "build" ]; then
  build
else
  help
fi