/* Store and edit data */

var fs = require('fs');
var path = require('path');

var lib = {};

lib.baseDataDirectory = path.join(__dirname,'/../.data/');

lib.create = (dir,file,data,callback) => {
    fs.open(lib.baseDataDirectory + dir + '/' + file + '.json', 'wx', (err,fileDescriptor) => {
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData,(err) => {
                if (!err) {
                    fs.close(fileDescriptor,()=>{
                        if (!err) {
                            callback(false);
                        }
                        else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback('Could not create file, does it already exist?');
        }
    });
}


// Read data from a file
lib.read = (dir,file,callback) => {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err,data) => {
        if(!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData);
        }
        else {
            callback(err,data);
        }
    });
}


module.exports = lib;