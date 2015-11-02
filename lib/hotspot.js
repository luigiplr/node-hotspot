var Promise = require('bluebird');

switch (process.platform) {
    case 'win64':
    case 'win32':
        var Hotspot = require('./utils/windows');
        break;
    case 'linux':
        var Hotspot = require('./utils/linux');
        break;
    case 'darwin':
        var Hotspot = require('./utils/osx');
        break;
    default:
        var Hotspot = 'Unsupported Platform: ' + process.platform;
}


module.exports.enable = function(opts) {
    if (typeof Hotspot !== 'string')
        return Hotspot.enable(opts);
    else
        return new Promise(function(reject) {
            reject(Hotspot);
        });
};

module.exports.disable = function(opts) {
    if (typeof Hotspot !== 'string')
        return Hotspot.disable(opts);
    else
        return new Promise(function(reject) {
            reject(Hotspot);
        });
};

module.exports.status = function(opts) {
    if (typeof Hotspot !== 'string')
        return Hotspot.getStatus(opts);
    else
        return new Promise(function(reject) {
            reject(Hotspot);
        });
};
