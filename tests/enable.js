var nodeHotspot = require('../index');


nodeHotspot.enable()
    .then(console.log.bind(this, 'Test Hotspot enabled!'))
    .catch(console.error)