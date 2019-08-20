
var envirnoments = {};

envirnoments.staging = {
    'port' : 3000,
    'envName' : 'staging'
}

envirnoments.production = {
    'port' : 5000,
    'envName' : 'production'
}


var currentEnvirnoment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Checking the Envirnoment Type Above

var envirnomentToExport = typeof(envirnoments[currentEnvirnoment]) == 'object' ? envirnoments[currentEnvirnoment] : envirnoments.staging;

module.exports = envirnomentToExport;