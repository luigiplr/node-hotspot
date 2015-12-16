import Promise from 'bluebird';

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
} catch () {
    Hotspot = 'Unsupported Platform: ' + process.platform;
}

export
default {
    enable(ops) {
        if (typeof Hotspot !== 'string')
            return Hotspot.enable(opts);
        else
            return new Promise(reject => reject.bind(this, Hotspot));
    },
    disable() {
        if (typeof Hotspot !== 'string')
            return Hotspot.disable();
        else
            return new Promise(reject => reject.bind(this, Hotspot));
    },
    stats() {
        if (typeof Hotspot !== 'string')
            return Hotspot.getStatus();
        else
            return new Promise(reject => reject.bind(this, Hotspot));
    }
}