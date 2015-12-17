var nodeHotspot = require('../index');


nodeHotspot.enable({
    ssid: 'node-hotspot',
    password: 'default2710',
    force: true
})
    .then(console.log.bind(this, 'Test Hotspot enabled!'))
    .catch(console.error)