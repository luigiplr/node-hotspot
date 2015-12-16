var nodeHotspot = require('../index');


nodeHotspot.init()
    .then(console.log.bind(this, 'Test Hotspot inited!'))
    .catch(console.error)