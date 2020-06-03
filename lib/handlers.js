/* Request Handlers */

var _data = require('./data');
var helpers = require('./helpers');

var handlers = {};

//Users
handlers.users = (data,callback) => {
    var acceptableMethods = ['post','get','put','delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data,callback);
    }
    else {
        callback(405,'Not Allowed');
    }
}

handlers._users = {};

handlers._users.post = (data,callback) => {
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (email && password) {
        //make sure user doens't exist
        _data.read('users',email,(err,data) => {
            if (err) {
                var hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    var userObject = {
                        'email'          : email,
                        'hashedPassword' : hashedPassword
                    };

                    _data.create('users',email,userObject,(err) => {
                        if (!err) {
                            callback(200);
                        }
                        else {
                            console.log(err);
                            callback(500,{'Error' : 'Could not create the user'});
                        }
                    });
                    }
                else {
                    callback(500,{'Error' : 'Could not hash password'});
                }
            }
            else {
                callback(400,{'Error' : 'User already exists'});
            }
        })
    }
    else {
        callback(400,{'Error':'Missing required fields'});
    }
}


//TODO user must be logged in to access this and be limited to themselves
handlers._users.get = (data,callback) => {
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.length > 0 ? data.queryStringObject.email : false;
    if (email) {
        _data.read('users',email,(err,data) => {
            if (!err && data) {
                delete data.hashedPassword;
                callback(200,data);
            }
            else {
                callback(404,{'Error' : 'Not Found'});
            }
        })
    }
    else {
        callback(400,{'Error' : 'Missing required fields'});
    }
}

//TODO as per get only allow update for own user
handlers._users.put = (data,callback) => {
    var email = typeof(data.payload.email) == 'string' && data.payload.email.length > 0 ? data.payload.email : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password : false;
    if (email) {
        _data.read('users',email,(err,userData) => {
            if (!err && userData) {
                if (email) {
                    userData.email = email;
                }
                if (password) {
                    userData.hashedPassword = helpers.hash(password);
                }
                _data.update('users',email,userData,(err) => {
                    if (!err) {
                        callback(200);
                    }
                    else {
                        callback(500,{'Error':'Could not update user'})
                    }
                })
            }
            else {
                callback(400,{'Error':'User does not exist'});
            }
        })
    } 
    else {
        callback(400,{'Error':'Missing required field'});
    }
}

handlers._users.delete = (data,callback) => {
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.length > 0 ? data.queryStringObject.email : false;
    if (email) {
        _data.read('users',email,(err,data) => {
            if (!err && data) {
                _data.delete('users',email,(err) => {
                    if (!err) {
                        callback(200);
                    }
                    else {
                        callback(500,{'Error':'Could not delete the user'});
                    }
                });
            }
            else {
                callback(400,{'Error':'User not found'});
            }
        })
    }
    else {
        callback(400,{'Error':'Missing required field'});
    }
}




handlers.currencies = (data,callback) => {
    var fs = require('fs');
    fs.readFile("currency-one-page-app.html", function(err,data)
    {
        if(err) {
            console.log(err);
        }
        else {
            callback(200, data.toString());
        }
    });
}



handlers.notFound = (data,callback) => {
    callback(404,'Not Found');
}



module.exports = handlers;