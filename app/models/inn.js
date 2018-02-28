var mongoose = require('mongoose');

// define inn model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Inn', {
    name : {type: String, default: ""},
    address : {type: String, default: ""},
    phoneNumber : {type: String, default: "0000000000"},
    url : {type: String, default: ""}
});
