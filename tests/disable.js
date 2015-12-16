var nodeHotspot = require('../index');


nodeHotspot.disable()
    .then(console.log.bind(this, 'Test Hotspot disabled!'))
    .catch(console.error)