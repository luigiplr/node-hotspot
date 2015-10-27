var Winreg = require('winreg');
var Promise = require('bluebird');

var regKey = new Winreg({
    hive: Winreg.HKCU,
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});


module.exports = {
    init: function(opts) {
        return new Promise((resolve) => {

        });
    },
    enable: function(opts) {
        return new Promise((resolve, reject) => {

        });
    },
    disable: function(opts) {
        return new Promise((resolve, reject) => {

        });
    },
    getStatus: function(opts) {
        return new Promise((resolve, reject) => {

        });
    },
    remove: function(opts) {
        return new Promise((resolve, reject) => {

        });
    }
};