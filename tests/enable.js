var nodeHotspot = require('../index');


nodeHotspot.enable({
    ssid: 'node-hotspot',
    password: 'default2710',
    force: true
}).then(function() {
    console.log('Test Hotspot enabled!')
}).catch(console.error)