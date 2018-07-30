var mongoose = require('mongoose');

// define guest model
module.exports = mongoose.model('Guest', {
    name : {type: String, default: 'no-name'},
    responded : {type: Boolean, default: false},
    numAdults : {type: Number, default: 0},
    numChildren : {type : Number, default: 0},
    numChildrenMeals : {type : Number, default: 0},
    numVegMeals : {type : Number, default: 0},
    comments : {type: String, default: ''},
    authCode : {type: String, unique : true, default: '0000', dropDups: true}
});
