'use strict';

var Promise = require('bluebird');

module.exports = {
    isRunning: false,

    init: function init(opts) {
        return new Promise(function (resolve) {});
    },

    enable: function enable(opts) {
        return new Promise(function (resolve, reject) {

            let command = __dirname + "/hostap ";
            if (opts.ssid != null) command += "-s" + opts.ssid.replaceAll(" ", "-") + " ";
            if (opts.password != null) command += "-p" + opts.password + " ";
            command += "start";

            require('child_process').exec(command, (error, stdout, stderr) => {});
        });
    },

    disable: function disable(opts) {
        return new Promise(function (resolve, reject) {
            let command = __dirname + "/hostap stop";
            require('child_process').exec(command, (error, stdout, stderr) => {});
        });
    },

    getStatus: function getStatus(opts) {
        return new Promise(function (resolve, reject) {
            let command = __dirname + "/hostap status";
            require('child_process').exec(command, (error, stdout, stderr) => {
                if (stdout === "HostAP") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    },

    remove: function remove(opts) {
        return new Promise(function (resolve, reject) {});
    }
};
