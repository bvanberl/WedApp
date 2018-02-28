var mongoose = require('mongoose');

// define guest model
module.exports = mongoose.model('Guest', {
    name : {type: String, default: 'no-name'},
    responded : {type: Boolean, default: false},
    numAdults : {type: Number, default: 0},
    numChildren : {type : Number, default: 0},
    numChildrenMeals : {type : Number, default: 0},
    dietaryRestrictions : {type : String, default: ''},
    authCode : {type: String, default: '0000'}
});
