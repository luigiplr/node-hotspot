'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Hotspot;

try {
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
} catch (e) {
    Hotspot = 'Unsupported Platform: ' + process.platform;
}

module.exports = {
    enable: function enable(opts) {
        var _this = this;

        if (typeof Hotspot !== 'string') return Hotspot.enable(opts);else return new _bluebird2.default(function (reject) {
            return reject.bind(_this, Hotspot);
        });
    },
    disable: function disable() {
        var _this2 = this;

        if (typeof Hotspot !== 'string') return Hotspot.disable();else return new _bluebird2.default(function (reject) {
            return reject.bind(_this2, Hotspot);
        });
    },
    stats: function stats() {
        var _this3 = this;

        if (typeof Hotspot !== 'string') return Hotspot.getStatus();else return new _bluebird2.default(function (reject) {
            return reject.bind(_this3, Hotspot);
        });
    }
};