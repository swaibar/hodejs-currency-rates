/* Various helpers */

var crypt = require('crypto');
var config = require('../config');

var helpers = {};

helpers.hash = (str) => {
    if (typeof(str) == 'string' && str.length > 0) {
        console.log(config);
        return crypt.createHmac('sha256',config.hashSecret).update(str).digest('hex');
    }
    return false;
};

helpers.parseJsonToObject = (str) => {
    console.log(str);
    try {
        var object = JSON.parse(str);
        return object;
    }
    catch(e) {
        console.log(str);
        console.log(e);
        return {};
    }
}

module.exports = helpers;