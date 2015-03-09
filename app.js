/* global require, console, module*/
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var rdr = Promise.promisify(require('recursive-readdir'));
var _ = require('underscore');
var mkdir = require('mkdirp');

var transform = function(inputDir, outputDir, data) {
    'use strict';

    if (!data) {
        console.log('Without data you are just copying files. Usage transform(inputDir, outputDir, data);');
    }

    var convert = function(fileName) {
        return fs.readFileAsync(fileName)
            .then(function(file) {
                return file.toString();
            })
            .then(_.template)
            .then(function(template) {
                return template(data);
            })
            .catch(function(error) {
                console.error('Convert error:', error);
            });
    };

    var inputToOut = function(fileName) {
        return outputDir + '/' + fileName.replace(new RegExp('^' + inputDir + '\/?'), '');
    };

    var mkdirForFile = function(file) {
        var fileName = inputToOut(file);
        var dirs = fileName.split('/').slice(0, -1).join('/');

        mkdir(dirs, function(err) {
            if (err) throw err;
        });

        return file;
    };

    var writeFile = function(inputFile) {
        convert(inputFile)
            .then(function(content) {
                return [inputToOut(inputFile), content];
            })
            .spread(fs.writeFileAsync)
            .catch(function(error) {
                console.error('Write file error:', error);
            });

        return inputToOut(inputFile);
    };

    rdr(inputDir)
        .then(function(fileName) {
            console.time('Transformed files in');
            return fileName;
        })
        .map(mkdirForFile)
        .map(writeFile)
        .then(function(fileName) {
            console.timeEnd('Transformed files in');
            return fileName;
        })
        .catch(console.error)
    ;
};

module.exports = transform;
