var Winreg = require('winreg');
var Promise = require('bluebird');
var util require('util');
var nodeWindows = require('node-windows');
var exec = require('exec');

var regKey = new Winreg({
    hive: Winreg.HKLM,
    key: '\\System\\CurrentControlSet\\Services\\WlanSvc\\Parameters\\HostedNetworkSettings'
});

module.exports = {
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
        return new Promise((resolve) => {
            this.exec('netsh wlan show hostednetwork').then(function(output) {
                output = output.split('Hosted network settings')[1].replace('-----------------------', '').split('Hosted network status')[0].split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean).concat(output.split('Hosted network status')[1].replace('---------------------', '').split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean));
                var statusObject = {};
                output.forEach(function(statusItem) {
                    if (statusItem.split(':')[0].trim() === 'SSID name')
                        var parm = statusItem.split(':')[1].trim().substring(1, statusItem.split(':')[1].trim().length - 1);
                    else
                        var parm = (statusItem.split(':').length > 2) ? statusItem.split(':').splice(0, 1).join(':').trim() : statusItem.split(':')[1].trim();
                    statusObject[statusItem.split(':')[0].trim()] = parm;
                });
                resolve(statusObject)
            });
        }).bind(this);
    },
    getClients: function(opts) {
        return new Promise((resolve) => {
            this.getStatus().then(function(statusObject) {
                resolve({
                    connected: (statusObject.Status === 'Started') ? parseInt(statusObject['Number of clients']) : 0,
                    max: parseInt(statusObject['Max number of clients'])
                });
            })
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
            nodeWindows.isAdminUser(function(isAdmin) {
                if (isAdmin)
                    this.exec(util.format('net %s wlansvc /Y', status)).then(resolve);
                else
                    nodeWindows.elevate(util.format('net %s wlansvc /Y', status), resolve)
            });
        }).bind(this);
    },
    checkICS: function() {
        return new Promise((resolve) => {
            utils.exec('IcsManager info', {
                env: {
                    PATH: path.resolve('../../bin/')
                }
            }).then(resolve);
        });
    },
    setICS: function(source, share) {
        return new Promise((resolve) => {
            utils.exec(util.format('IcsManager enable "%s" "%s""', share, source), {
                env: {
                    PATH: path.resolve('../../bin/')
                }
            }).then(resolve);
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