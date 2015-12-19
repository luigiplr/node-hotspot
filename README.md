[WIP] node-hotspot
--------------

[![npm version](https://badge.fury.io/js/node-hotspot.svg)](http://badge.fury.io/js/node-hotspot)


Manage, Add & Remove infrastructure mode hotspots on Windows 7+ for [Node.js](http://nodejs.org) apps.

Node-hotspot 


Installation
-------

```bash
$ npm install node-hotspot --save
```

Code example
-------

```js
var hotspot = require('node-hotspot');

var opts = {
    ssid: 'hotspot name', 
    password: '66ahhhs641jk', 
    force: true, // (optional)  if hosting a network already turn it off and run ours.
    adaptor: 'Ethernet' // (optional / false) name of adaptor to have ICS (Internet Connection Sharing) share internet from, passing false disables ICS all together - if non givin node-hotspot will attempt to find currently connected adaptor automatically
};

hotspot.enable(opts)
    .then(function() {
        console.log('Hotspot Enabled')
    })
    .catch(function(e) {
        Console.log('Something went wrong; Perms?', e)
    });

hotspot.disable(opts)
    .then(function() {
        console.log('Hotspot disabled')
    })
    .catch(function(e) {
        Console.log('Something went wrong; Perms?', e)
    });

hotspot.status(opts)
    .then(function(status) {
        console.log('Hotspot status: ' + status) //status contains clients object and state
    });

```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/luigiplr/node-hotspot/issues/new) on GitHub and I'll  be happy to help.

Contribute
----------

- Issue Tracker: [github.com/luigiplr/node-hotspot/issues](https://github.com/luigiplr/node-hotspot/issues)
- Source Code: [github.com/luigiplr/node-hotspot](https://github.com/luigiplr/node-hotspot)



License
-------

The project is licensed under the GPL-3.0 license.
