var Winreg = require('winreg');
var Promise = require('bluebird');
var nodeWindows = require('node-windows');
var exec = require('exec');

var regKey = new Winreg({
    hive: Winreg.HKLM,
    key: '\\System\\CurrentControlSet\\Services\\WlanSvc\\Parameters\\HostedNetworkSettings'
});

module.exports = {
    init: function(opts) {
        return new Promise((resolve) => {

        });
    },
    check: function() {
        var command = 'netsh wlan show drivers';

        this.exec(command).then(function(output) {
            wifiActions.isCompatible((output.indexOf('Hosted network supported  : Yes') > -1));
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
    },
    exec: function(opts) {
        return new Promise((resolve, reject) => {
            exec(args, (stderr, stdout, code) => {
                if (code) {
                    var cmd = Array.isArray(args) ? args.join(' ') : args;
                    console.log(cmd + ' returned non zero exit code. Stderr: ' + stderr);
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            });
        });
    }
};