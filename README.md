# NodeJS Transform
Transform all files in one directory (and below) to another (or the same). Use underscore templates.

# Install

`npm install transform-files`

or if you want it system wide: (-g = global)

`npm install -g transform-files`

# Usage

You can use this NPM as a program or as dependency in your own NPM.

## From command line

```
Usage: transform dir/ newdir/ [data]
       transform /etc /docker/etc '{"domain": "example.com"}'
```

## In a module

```javascript
var transform = require('transform-files');
var inputDir = 'config/';
var outputDir = 'newConfig/';

var data = someAPI.fetch(); // Return a javascript object. For ex. { domain: 'example.com' }

transform(inputDir, outputDir, data);
```
