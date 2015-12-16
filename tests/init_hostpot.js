var nodeHotspot = require('../index');


nodeHotspot.enable()
    .then(console.log.bind(this, 'Test Hotspot inited!'))
    .catch(console.error)