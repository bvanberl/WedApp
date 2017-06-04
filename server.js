// MODULES =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// COLLECTIONS ================================================
var Guest     = require('./app/models/guest');
var Announcement     = require('./app/models/announcement');


var db = require('./config/db');
mongoose.connect(db.url); // connect to our mongoDB data
var port = process.env.PORT || 8080; // set port


// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

var router = express.Router();

// GUESTS ROUTES ===================================================================================================================
router.route('/guests')
    // create a guest (accessed at POST http://localhost:8080/api/guests)
    .post(function(req, res) {
        var guest = new Guest();      // create a new instance of the Guest model
        guest.name = req.body.name;
        guest.responded = req.body.responded;
        guest.numAttending = req.body.numAttending;
        guest.authCode = req.body.authCode;
        // save the guest and check for errors
        guest.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Guest created!' });
        });
    })
    // get all the guests (accessed at GET http://localhost:8080/api/guests)
    .get(function(req, res) {
        Guest.find(function(err, guests) {
            if (err)
                res.send(err);
            res.json(guests);
        });
    });
router.route('/guests/:guest_id') // Get a guest by his/her ID
    .get(function(req, res) {
        Guest.findById(req.params.guest_id, function(err, guest) {
            if (err)
                res.send(err);
            res.json(guest);
        });
    })
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Guest.findById(req.params.guest_id, function(err, guest) {
            if (err)
                res.send(err);
            guest.name = req.body.name;
            guest.responded = req.body.responded;
            guest.numAttending = req.body.numAttending;
            guest.authCode = req.body.authCode;
            guest.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Guest updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Guest.remove({
            _id: req.params.guest_id
        }, function(err, guest) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });


// ANNOUNCEMENT ROUTES
router.route('/announcements')
    // create an announcement (accessed at POST http://localhost:8080/api/announcements)
    .post(function(req, res) {
        var announcement = new Announcement();      // create a new instance of the announcement model
        console.log(req.body.datetime + ", MESSAGE:" + req.body.content);
        announcement.datetime = req.body.datetime;
        announcement.content = req.body.content;
        // save the announcement and check for errors
        announcement.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Announcement created!' });
        });
    })
    // get all the announcements (accessed at GET http://localhost:8080/api/announcements)
    .get(function(req, res) {
        Announcement.find(function(err, announcements) {
            if (err)
                res.send(err);
            res.json(announcements);
        });
    });
router.route('/announcements/:announcement_id') // Get a announcement by his/her ID
    .get(function(req, res) {
        Announcement.findById(req.params.announcement_id, function(err, announcement) {
            if (err)
                res.send(err);
            res.json(announcement);
        });
    })
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Announcement.findById(req.params.announcement_id, function(err, announcement) {
            if (err)
                res.send(err);
            announcement.datetime = req.body.datetime;
            announcement.content = req.body.content;
            announcement.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Announcement updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Announcement.remove({
            _id: req.params.announcement_id
        }, function(err, announcement) {
            if (err)
                res.send(err);
            res.json({ message: 'Announcement successfully deleted' });
        });
    });



// REGISTER ROUTES =========================================================
// all routes will be prefixed with /api
app.use('/api', router);

router.get('*', function(req, res) {
    res.sendfile('./public/index.html', { root: __dirname }); // load our public/index.html file
});


// routes ==================================================
//require('./app/routes')(app); // configure our routes
app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('WedApp is live on port ' + port);

// expose app
exports = module.exports = app;
