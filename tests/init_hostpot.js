var nodeHotspot = require('../');


nodeHotspot.init()
    .then(console.log.bind(this, 'Test Hotspot inited!'))
    .catch(console.error)