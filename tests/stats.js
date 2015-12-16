var nodeHotspot = require('../index');


nodeHotspot.stats()
    .then(function(stats){
    	console.log(stats);
    })
    .catch(console.error)