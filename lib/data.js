/* Store and edit data */

'use strict';

var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

var lib = {};

lib.baseDataDirectory = path.join(__dirname,'/../.data/');

lib.create = (dir,file,data,callback) => {
    fs.open(lib.baseDataDirectory + dir + '/' + file + '.json', 'wx', (err,fileDescriptor) => {
        if (err || !fileDescriptor) callback('Could not create file, does it already exist?');
        else {
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData,(err) => {
                if (err) callback('Error writing to new file');
                else {
                    fs.close(fileDescriptor,()=>{
                        if (err) callback('Error closing new file');
                        else {
                            callback(false);
                        }
                    });
                }
            });
        }
    });
}


// Read data from a file
lib.read = (dir,file,callback) => {
    var filename = lib.baseDataDirectory + dir + '/' + file + '.json';
    fs.readFile(filename, 'utf8', (err,data) => {
        if(!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData);
        }
        else {
            callback(err,data);
        }
    });
}

// Update data in a file
lib.update = function (dir, file, data, callback) {
    var filename = lib.baseDataDirectory + dir + '/' + file + '.json';
    fs.open(filename, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, JSON.stringify(data), (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing existing file');
                                }
                            });
                        } else {
                            callback('Error writing to existing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            callback('Could not open file for updating, it may not exist yet');
        }
    });
};


lib.delete = (dir, file, callback) => {
    var filename = lib.baseDataDirectory + dir + '/' + file + '.json';
    fs.unlink(filename, (err) => {
        callback(err);
    });

};

lib.list = function (dir, callback) {
    dir = lib.baseDataDirectory + dir + '/';
    fs.readdir(dir, (err, data) => {
        if (!err && data && data.length > 0) {
            var trimmedFileNames = [];
            data.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        }
        else {
            callback(err, data);
        }
    });
};


module.exports = lib;