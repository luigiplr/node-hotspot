var Promise = require('bluebird');
var util = require('util');
var child_process = require('child_process');

module.exports = {
    enable: function(opts) {
        return new Promise((resolve) => {
            this.create(opts.ssid, opts.password)
                .then(this.activate)
                .then(resolve);
        }).bind(this);
    },
    disable: function(opts) {
        return new Promise((resolve) => {
            this.exec('netsh wlan stop hostednetwork')
                .then(function() {
                    return this.exec('netsh wlan set hostednetwork mode=disallow');
                }.bind(this))
                .then(resolve);
        }).bind(this);
    },
    getStatus: function() {
        return new Promise((resolve) => {
            this.exec('netsh wlan show hostednetwork')
                .then(function(output) {
                    output = output.split('Hosted network settings')[1].replace('-----------------------', '').split('Hosted network status')[0].split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean).concat(output.split('Hosted network status')[1].replace('---------------------', '').split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean));
                    var statusObject = {};
                    output.forEach(function(statusItem) {
                        if (statusItem.split(':')[0].trim() === 'SSID name')
                            var parm = statusItem.split(':')[1].trim().substring(1, statusItem.split(':')[1].trim().length - 1);
                        else
                            var parm = (statusItem.split(':').length > 2) ? statusItem.split(':').splice(0, 1).join(':').trim() : statusItem.split(':')[1].trim();
                        statusObject[statusItem.split(':')[0].trim()] = parm;
                    });
                    resolve(statusObject);
                });
        }).bind(this);
    },
    getClients: function(opts) {
        return new Promise((resolve) => {
            this.getStatus()
                .then(function(statusObject) {
                    resolve({
                        connected: (statusObject.Status === 'Started') ? parseInt(statusObject['Number of clients']) : 0,
                        max: parseInt(statusObject['Max number of clients'])
                    });
                })
        }).bind(this);
    },
    create: function(name, key) {
        return new Promise((resolve) => {
            this.exec('netsh wlan set hostednetwork mode=allow')
                .then(function() {
                    return this.exec(util.format('netsh wlan set hostednetwork ssid="%s" key="%s" keyUsage=temporary', name, key));
                }.bind(this))
                .then(resolve);
        }).bind(this);
    },
    exec: function(opts, options) {
        return new Promise((resolve, reject) => {
            options = options || {};
            options.env = options.env || {};
            child_process.exec(args, options, (stderr, stdout, code) => {
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