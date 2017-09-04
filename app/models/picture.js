var mongoose = require('mongoose');

// define picture model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Picture', {
    filename : {type: String, default: ""}
});
