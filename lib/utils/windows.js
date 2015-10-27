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
        return new Promise((resolve) => {
            this.exec('netsh wlan show drivers').then(function(output) {
                resolve((output.indexOf('Hosted network supported  : Yes') > -1));
            });
        }).bind(this);
    },
    enable: function(opts) {
        return new Promise((resolve) => {
            this.utils.exec('netsh wlan start hostednetwork').then(function(output) {
                resolve();
            });
        }).bind(this);
    },
    disable: function(opts) {
        return new Promise((resolve) => {
            this.utils.exec('netsh wlan stop hostednetwork').then(function(output) {
                resolve()
            });
        }).bind(this);
    },
    getStatus: function(opts) {
        return new Promise((resolve, reject) => {

        });
    },
    getClients: function(opts) {
        return new Promise((resolve, reject) => {
            this.exec('netsh wlan show hostednetwork').then(function(output) {

            });
        }).bind(this);
    },
    remove: function(opts) {
        return new Promise((resolve, reject) => {
            this.wlansvc('stop')
                .then(function() {
                    return new Promise((resolve) => {
                        regKey.remove('HostedNetworkSettings', resolve);
                    });
                })
                .then(function() {
                    return this.wlansvc('start');
                }, this)
                .then(resolve);
        }).bind(this);
    },
    wlansvc: function(status) {
        return new Promise((resolve) => {
            nodeWindows.elevate('net ' + status + ' wlansvc /Y', resolve);
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