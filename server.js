// MODULES =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// COLLECTIONS ================================================
var Guest     = require('./app/models/guest');


var db = require('./config/db');
mongoose.connect(db.url); // connect to our mongoDB database
var port = process.env.PORT || 8080; // set port


// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

var router = express.Router();

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
// REGISTER ROUTES =========================================================
// all routes will be prefixed with /api
app.use('/api', router);

router.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load our public/index.html file
});




// routes ==================================================
//require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('WedApp is live on port ' + port);

// expose app
exports = module.exports = app;
