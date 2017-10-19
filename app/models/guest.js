var mongoose = require('mongoose');

// define guest model
module.exports = mongoose.model('Guest', {
    name : {type: String, default: 'no-name'},
    responded : {type: Boolean, default: false},
    numAttending : {type: Number, default: 0},
    authCode : {type: String, default: '0000'}
});
