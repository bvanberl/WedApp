var mongoose = require('mongoose');

// define announcement model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Announcement', {
    datetime : {type: Date, default: Date()},
    content : {type: String, default: ""}
});
