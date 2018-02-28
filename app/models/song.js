var mongoose = require('mongoose');

// define song model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Song', {
    name : {type: String, default: 'no-name'},
    artist : {type: String, default: 'no-artist'},
    noRequests : {type: Number, default: 1}
});
