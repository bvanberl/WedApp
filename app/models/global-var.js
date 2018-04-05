var mongoose = require('mongoose');

// define guest model
module.exports = mongoose.model('GlobalVariable', {
    identifier : {type: String, default: ''},
    value : {type: String, default: ''}
});
