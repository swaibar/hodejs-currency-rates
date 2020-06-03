/* configuration settings, not that this is intended for a production server */

var enviroments = {};

enviroments.dev = {
    'envName' : 'dev',
    'httpPort' : 3000,
    'hashSecret': 'mysecret'
};

enviroments.production = {
    'envName' : 'production',
    'httpPort' : 3000,
    'hashSecret': 'differentsecret'
};

var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.dev;

module.exports = enviromentToExport;