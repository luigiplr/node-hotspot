import Promise from 'bluebird';
import _ from 'lodash';
import util from 'util';
import path from 'path';
import child_process from 'child_process';

var arch = false;


module.exports = {
    arch: 'ia32',
    enable(opts) {
        return new Promise((resolve, reject) => {

            if (opts.force) {
                opts.force = false;
                return this.disable()
                    .then(this.enable.bind(this, opts))
                    .then(resolve)
                    .catch(reject);
            }
            this.getArch()
                .then(this.create.bind(this, opts.ssid, opts.password))
                .then(() => {
                    return new Promise((resolve, reject) => {
                        if (opts.adaptor) {
                            this.ConnectedAdaptor = opts.adaptor;
                            return resolve();
                        }
                        if (opts.adaptor === false) {
                            this.ConnectedAdaptor = false;
                            return resolve();
                        }
                        this.getInternetConnectedAdaptor()
                            .then(ConnectedAdaptor => {
                                this.ConnectedAdaptor = ConnectedAdaptor.InterfaceAlias;
                                resolve()
                            })
                            .catch(reject);
                    });
                })
                .then(() => {
                    console.log('Starting hotspot');
                    return this.exec('netsh wlan start hostednetwork');
                })
                .then(this.getNetworkAdaptors.bind(this))
                .then(NetworkAdaptors => {
                    console.log('Hotspot started!');
                    return _.result(_.find(NetworkAdaptors, adaptor => {
                        return adaptor.interface === 'Microsoft Hosted Network Virtual Adapter';
                    }), 'name');
                })
                .then(hostedNetwork => {
                    return new Promise((resolve, reject) => {
                        if (this.ConnectedAdaptor)
                            _.delay(() => {
                                this.exec(util.format('"%s" enable "%s" "%s" true', path.join(__dirname, '../../', 'bin/win32/IcsManager.exe'), this.ConnectedAdaptor, hostedNetwork))
                                    .then(resolve)
                                    .catch(reject);
                            }, 500);
                        else
                            resolve();
                    });
                })
                .then(() => {
                    return console.log('ICS Configuration successful!');
                })
                .then(resolve)
                .catch(reject);
        });
    },
    disable(opts) {
        return new Promise((resolve, reject) => {
            this.exec('netsh wlan stop hostednetwork')
                .then(() => {
                    return this.exec('netsh wlan set hostednetwork mode=disallow');
                })
                .then(resolve)
                .catch(reject);
        });
    },
    getStatus() {
        return new Promise((resolve, reject) => {
            this.getArch()
                .then(() => {
                    return Promise.all([this.exec('netsh wlan show hostednetwork'), this.getNetworkAdaptors(), this.getInternetConnectedAdaptor(), this.getCompatible()])
                })
                .spread((status, NetworkAdaptors, ConnectedAdaptor, Compatible) => {
                    var output = status.split('Hosted network settings')[1]
                        .replace('-----------------------', '')
                        .split('Hosted network status')[0]
                        .split('\n').map(Function.prototype.call, String.prototype.trim)
                        .filter(Boolean)
                        .concat(status.split('Hosted network status')[1]
                            .replace('---------------------', '')
                            .split('\n').map(Function.prototype.call, String.prototype.trim)
                            .filter(Boolean));

                    var statusObject = {};
                    output.forEach(statusItem => {
                        if (statusItem.split(':')[0].trim() === 'SSID name')
                            var parm = statusItem.split(':')[1].trim().substring(1, statusItem.split(':')[1].trim().length - 1);
                        else
                            var parm = (statusItem.split(':').length > 2) ? statusItem.split(':').splice(0, 1).join(':').trim() : statusItem.split(':')[1].trim();
                        statusObject[statusItem.split(':')[0].trim()] = parm;
                    });
                    statusObject['compatible'] = Compatible;
                    statusObject['networkAdaptors'] = NetworkAdaptors;
                    statusObject['connectedAdaptor'] = ConnectedAdaptor;
                    resolve(statusObject);
                })
                .catch(reject);
        });
    },
    getCompatible() {
        return new Promise((resolve, reject) => {
            this.exec('netsh wlan show drivers')
                .then(output => {
                    var networkData = output.split('\n')
                        .map(Function.prototype.call, String.prototype.trim)
                        .filter(Boolean);

                    var matches = _.filter(networkData, line => {
                            return line.indexOf('Hosted network supported') !== -1;
                        })[0]
                        .split(':')
                        .map(Function.prototype.call, String.prototype.trim)
                        .filter(Boolean);
                    resolve(matches[1] === 'Yes');
                })
                .catch(reject);
        });
    },
    getNetworkAdaptors() {
        return new Promise((resolve, reject) => {
            this.exec(util.format('"%s" "Get-NetAdapter | ft Name, Status, ifIndex, MacAddress, InterfaceDescription"', this.getPowershell()))
                .then(output => {
                    var networkData = output.split('--------------------')[1]
                        .split('\n')
                        .map(Function.prototype.call, String.prototype.trim)
                        .filter(Boolean);

                    var networkAdaptors = [];
                    networkData.forEach(statusItem => {
                        var splitString = (statusItem.indexOf('Disconnected') > -1) ? 'Disconnected' : ((statusItem.indexOf('Not Present') > -1) ? 'Not Present' : 'Up');
                        networkAdaptors.push({
                            interface: statusItem.split(splitString)[1].trim().split(' ').splice(2).map(Function.prototype.call, String.prototype.trim).filter(Boolean).join(' '),
                            mac: statusItem.split(splitString)[1].split(' ').splice(1).map(Function.prototype.call, String.prototype.trim).filter(Boolean)[1],
                            name: statusItem.split(splitString)[0].trim(),
                            status: (splitString === 'Up') ? 'Connected' : ((splitString === 'Not Present') ? 'Disabled' : 'Disconnected'),
                            id: statusItem.split(splitString)[1].trim().split(' ')[0]
                        });
                    });
                    resolve(networkAdaptors);
                })
                .catch(reject);
        });
    },
    getInternetConnectedAdaptor() {
        return new Promise((resolve, reject) => {
            this.exec(util.format('"%s" "Get-NetConnectionProfile"', this.getPowershell()))
                .then(output => {
                    var networkData = output.split('\n')
                        .map(Function.prototype.call, String.prototype.trim)
                        .filter(Boolean);
                    var statusObject = {};
                    networkData.forEach((statusItem) => {
                        statusObject[statusItem.split(':')[0].trim()] = statusItem.split(':')[1].trim()
                    });
                    this.getLocalIp(statusObject.InterfaceIndex)
                        .then(ip => {
                            statusObject['ip'] = ip;
                            resolve(statusObject);
                        });
                })
                .catch(reject);
        });
    },
    getLocalIp(AdapterID) {
        return new Promise(resolve => {
            this.exec(util.format('"%s" "(Get-NetAdapter -ifIndex "%s" | Get-NetIPAddress).IPv4Address"', this.getPowershell(), AdapterID))
                .then(output => {
                    resolve(output);
                });
        });
    },
    getClients(opts) {
        return new Promise((resolve, reject) => {
            this.getStatus()
                .then(statusObject => {
                    resolve({
                        connected: (statusObject.Status === 'Started') ? parseInt(statusObject['Number of clients']) : 0,
                        max: parseInt(statusObject['Max number of clients'])
                    });
                })
                .catch(reject);
        });
    },
    create(name, key) {
        console.log('Configuring hotspot with SSID:', name);

        return new Promise((resolve, reject) => {
            this.exec('netsh wlan set hostednetwork mode=allow')
                .then(() => {
                    return this.exec(util.format('netsh wlan set hostednetwork ssid="%s" key="%s" keyUsage=temporary', name, key));
                })
                .then(resolve)
                .catch(reject);
        });
    },
    getArch() {
        return new Promise((resolve, reject) => {
            this.exec('wmic os get osarchitecture')
                .then(osArch => {
                    if (osArch.split('\n')[1].match(/64/))
                        this.arch = 'x64'
                    return resolve();
                })
                .catch(reject);
        });
    },
    getPowershell() {
        if (this.arch === 'x64' && process.arch === 'ia32')
            return path.join(process.env.windir, 'sysnative/WindowsPowerShell/v1.0/powershell.exe');
        else
            return path.join(process.env.windir, 'System32/WindowsPowerShell/v1.0/powershell.exe');
    },
    exec(args, options = {
        env: {}
    }) {
        return new Promise((resolve, reject) => {
            options.env = _.defaultsDeep(options.env, process.env);
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