var Guest = require('./models/guest');
var Announcement = require('./models/announcement');
var User = require('./models/user');

    module.exports = function(app) {

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/index.html'); // load our public/index.html file
        });


    };
