[![Build Status](https://travis-ci.org/calebissharp/lms-inspector.svg?branch=master)](https://travis-ci.org/calebissharp/lms-inspector)
[![npm](https://img.shields.io/npm/v/lms-inspector.svg)](https://www.npmjs.com/package/lms-inspector)
# lms-inspector

A library for extracting metadata from an LMS archive.

Example: [https://github.com/calebissharp/lms-inspector-example](https://github.com/calebissharp/lms-inspector-example)

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
const LMSInspector = require('lms-inspector');

const file = new File(['hello world'], 'file.zip');

LMSInspector.inspect(file)
  .then(info => { /* Do stuff */ });
```
