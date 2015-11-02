var Promise = require('bluebird');
var util = require('util');
var child_process = require('child_process');

module.exports = {
    enable: function(opts) {
        return new Promise((resolve) => {
            if (opts.force)
                this.disable();

            this.create(opts.ssid, opts.password)
                .then(function() {
                    return this.exec('netsh wlan start hostednetwork');
                }.bind(this))
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
            Promise.all([this.exec('netsh wlan show hostednetwork'), this.getNetworkAdaptors(), this.getInternetConnectedAdaptor()])
                .spread(function(status, NetworkAdaptors, ConnectedAdaptor) {
                    var output = status.split('Hosted network settings')[1].replace('-----------------------', '').split('Hosted network status')[0].split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean).concat(status.split('Hosted network status')[1].replace('---------------------', '').split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean));
                    var statusObject = {};
                    output.forEach(function(statusItem) {
                        if (statusItem.split(':')[0].trim() === 'SSID name')
                            var parm = statusItem.split(':')[1].trim().substring(1, statusItem.split(':')[1].trim().length - 1);
                        else
                            var parm = (statusItem.split(':').length > 2) ? statusItem.split(':').splice(0, 1).join(':').trim() : statusItem.split(':')[1].trim();
                        statusObject[statusItem.split(':')[0].trim()] = parm;
                    });
                    statusObject['networkAdaptors'] = NetworkAdaptors;
                    statusObject['connectedAdaptor'] = ConnectedAdaptor;
                    resolve(statusObject);
                }.bind(this))
        }).bind(this);
    },
    getNetworkAdaptors: function() {
        return new Promise((resolve) => {
            this.exec('powershell "Get-NetAdapter | ft Name, Status, ifIndex, InterfaceDescription"')
                .then(function(output) {
                    var networkData = output.split('--------------------')[1].split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean);
                    var networkAdaptors = [];
                    networkData.forEach(function(statusItem) {
                        var splitString = (statusItem.indexOf('Disconnected') > -1) ? 'Disconnected' : ((statusItem.indexOf('Not Present') > -1) ? 'Not Present' : 'Up');
                        networkAdaptors.push({
                            interface: statusItem.split(splitString)[1].trim().split(' ').splice(1).map(Function.prototype.call, String.prototype.trim).filter(Boolean).join(' '),
                            name: statusItem.split(splitString)[0].trim(),
                            status: (splitString === 'Up') ? 'Connected' : ((splitString === 'Not Present') ? 'Disabled' : 'Disconnected'),
                            id: statusItem.split(splitString)[1].trim().split(' ')[0]
                        });
                    });
                    resolve(networkAdaptors);
                })
        }).bind(this);
    },
    getInternetConnectedAdaptor: function() {
        return new Promise((resolve) => {
            this.exec('powershell "Get-NetConnectionProfile"')
                .then(function(output) {
                    var networkData = output.split('\n').map(Function.prototype.call, String.prototype.trim).filter(Boolean);
                    var statusObject = {};
                    networkData.forEach(function(statusItem) {
                        statusObject[statusItem.split(':')[0].trim()] = statusItem.split(':')[1].trim()
                    });
                    this.getLocalIp(statusObject.InterfaceIndex)
                        .then(function(ip) {
                            statusObject['ip'] = ip;
                            resolve(statusObject);
                        });
                }.bind(this))
        }).bind(this);
    },
    getLocalIp: function(AdapterID) {
        return new Promise((resolve) => {
            this.exec(util.format('powershell "(Get-NetAdapter -ifIndex "%s" | Get-NetIPAddress).IPv4Address"', AdapterID)).then(function(output) {
                resolve(output.replace('\n', ''));
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
    exec: function(args, options) {
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