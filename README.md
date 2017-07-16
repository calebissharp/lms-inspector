[![Build Status](https://travis-ci.org/calebissharp/lms-inspector.svg?branch=master)](https://travis-ci.org/calebissharp/lms-inspector)
[![npm](https://img.shields.io/npm/v/lms-inspector.svg)](https://www.npmjs.com/package/lms-inspector)
# lms-inspector

A library for extracting metadata from an LMS archive.

## Getting Started

### Clone this repository
`git clone https://github.com/calebissharp/lms-inspector.git`

### Install dependencies
`yarn`

### Watch for changes and build
`yarn dev`

### Build
`yarn build`

### Run tests
`yarn test`

### Run tests in watch mode
`yarn test:watch`

## Usage
`npm install lms-inspector`

```javascript
const fs = require('fs');
const path = require('path');
const LMSInspector = require('lms-inspector');

const file = new Uint8Array(fs.readFileSync(path.resolve(__dirname, 'file.zip'))).buffer;

LMSInspector.inspect(file)
  .then(name => { /* Do stuff */ });
```
