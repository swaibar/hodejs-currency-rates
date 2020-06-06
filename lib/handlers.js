/* Request Handlers */

'use strict';

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

//requires email and valid token
handlers._users.get = (data,callback) => {
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.length > 0 ? data.queryStringObject.email : false;
    if (email) {
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verfiyToken(token,email,(tokenIsValid) => {
            if (tokenIsValid) {
                _data.read('users',email,(err,data) => {
                    if (!err && data) {
                        delete data.hashedPassword;
                        callback(200,data);
                    }
                    else {
                        callback(404,{'Error' : 'Not Found'});
                    }
                });
            }
            else {
                callback(403,{'Error':'Missing required token in header, or token is invalid'});
            }
        })
    }
    else {
        callback(400,{'Error' : 'Missing required fields'});
    }
}

//requires email, password and valid token
handlers._users.put = (data,callback) => {
    var email = typeof(data.payload.email) == 'string' && data.payload.email.length > 0 ? data.payload.email : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password : false;
    if (email) {
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers.verfiyToken(token,email,(tokenIsValid) => {
            if (tokenIsValid) {
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
                                callback(500,{'Error':'Could not update user'});
                            }
                        })
                    }
                    else {
                        callback(400,{'Error':'User does not exist'});
                    }
                })
            }
            else {
                callback(403,{'Error':'Missing required token in header, or token is invalid'});
            }
        });
    } 
    else {
        callback(400,{'Error':'Missing required field'});
    }
}

handlers._users.delete = (data,callback) => {
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.length > 0 ? data.queryStringObject.email : false;
    if (email) {
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        handlers._tokens.verfiyToken(token,email,(tokenIsValid) => {
            if (tokenIsValid) {
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
                });
            }
            else {
                callback(403,{'Error':'Missing required token in header, or token is invalid'});
            }
        });
    }
    else {
        callback(400,{'Error':'Missing required field'});
    }
}

//Tokens
handlers.tokens = (data,callback) => {
    var acceptableMethods = ['post','get','put','delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data,callback);
    }
    else {
        callback(405,'Not Allowed');
    }
}

handlers._tokens = {};

//to create a token we need email and password
handlers._tokens.post = (data, callback) => {
    var email = typeof(data.payload.email) == 'string' && data.payload.email.length > 0 ? data.payload.email : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password : false;
    if (email && password) {
        _data.read('users',email,(err,userData) => {
            if (!err && userData) {
                var sentPasswordHash = helpers.hash(password);
                if (sentPasswordHash == userData.hashedPassword) {
                    var tokenId = helpers.createRandomString(20);
                    var tokenObject = {
                        'email'   : email,
                        'id'      : tokenId,
                        'expires' : Date.now() + 1000 * 60 * 60
                    };
                    _data.create('tokens',tokenId,tokenObject,(err) => {
                        if (!err) {
                            callback(200,tokenObject);
                        }
                        else {
                            callback(500,{'Error':'could not create token'})
                        }
                    });
                }
                else {
                    callback(400,{'Error':'Password did not match'});
                }
            }
            else {
                callback(400, {'Error':'User not found'});
            }
        })
    }
    else {
        callback(400,{'Error' : 'Missing required fields'});
    }
}

//get the token by id
handlers._tokens.get = (data, callback) => {
    var tokenId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id : false;
    if (tokenId) {
        _data.read('tokens',tokenId,(err,tokenData) => {
            if (!err && tokenData) {
                callback(200,tokenData)
            }
            else {
                callback(404);
            }
        })
    }
    else {
        callback(400,{'Error':'Missing required field'});
    }
}

//only needed to extend expires for token
handlers._tokens.put = (data, callback) => {
    var tokenId = typeof(data.payload.id) == 'string' && data.payload.id.length == 20 ? data.payload.id : false;
    var extend = typeof(data.payload.extends) == 'boolean' && data.payload.extends == true ? true : false;
    
    if (tokenId && extend) {
        _data.read('tokens',tokenId,(err,tokenData) => {
            if (!err && tokenData) {
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 3600 * 60 *60;
                    _data.update('tokens',tokenId,tokenData,(err) => {
                        if (!err) {
                            callback(200);
                        }
                        else {
                            callback(500,{'Error':'Could not update token'});
                        }
                    })
                }
                else {
                    callback(400,{'Error':'Token expired'});
                }
            }
            else {
                callback(400,{'Error':'Token not found'});
            }
        })
    }
    else {
        callback(400,{'Error':'Missing required fields'});
    }
}

handlers._tokens.delete = (data, callback) => {
    var tokenId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id : false;
    if (tokenId) {
        _data.read('tokens',tokenId,(err,tokenData) => {
            if (!err && tokenData) {
                _data.delete('tokens',tokenId,(err) => {
                    if (!err) {
                        callback(200);
                    }
                    else {
                        callback(500,{'Error':'Could not delete the Token'});
                    }
                });
            }
            else {
                callback(400,{'Error':'Token not found'});
            }
        })
    }
    else {
        callback(400,{'Error':'Missing required field'});
    }
}



//if a token is valid for a given user
handlers.verfiyToken = (tokenId, email, callback) => {
    _data.read('tokens',tokenId,(err,tokenData) => {
        if (!err && tokenData) {
            if (tokenData.email == email && tokenData.expires > Date.now()) {
                callback(true);
            }
        }
        else {
            callback(false);
        }
    })
}



handlers.currencies = (data,callback) => {
    if (data.method == 'get') {
        helpers.mergeTemplate("currency-one-page-app.html", (err,mergedPage) => {
            if (!err && mergedPage) {
                callback(200,mergedPage);
            }
            else {
                callback(500,{'Error':err});
            }
        });
    }
    else {
        callback(405,'Not Allowed');
    }
}


handlers.accountCreate = (data,callback) => {
    if (data.method == 'get') {
        helpers.mergeTemplate("account_create.html", (err,mergedPage) => {
            if (!err && mergedPage) {
                callback(200,mergedPage);
            }
            else {
                callback(500,{'Error':err});
            }
        });
    }
    else {
        callback(405,'Not Allowed');
    }
}


handlers.sessionCreate = (data,callback) => {
    if (data.method == 'get') {
        helpers.mergeTemplate("session_create.html", (err,mergedPage) => {
            if (!err && mergedPage) {
                callback(200,mergedPage);
            }
            else {
                callback(500,{'Error':err});
            }
        });
    }
    else {
        callback(405,'Not Allowed');
    }
}



handlers.notFound = (data,callback) => {
    callback(404,'Not Found');
}



module.exports = handlers;