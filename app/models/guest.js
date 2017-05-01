var mongoose = require('mongoose');

// define guest model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Guest', {
    name : {type: String, default: 'no-name'},
    responded : {type: Boolean, default: false},
    numAttending : {type: Number, default: 0},
    authCode : {type: String, default: '0000'}
});
