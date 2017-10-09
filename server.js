// MODULES =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path           = require('path');
var cookieParser   = require('cookie-parser');
var passport       = require('passport');
var jwt            = require('express-jwt');
var multer         = require('multer');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

// COLLECTIONS ================================================
var Guest     = require('./app/models/guest');
var Announcement     = require('./app/models/announcement');
var Picture     = require('./app/models/picture');
var User     = require('./app/models/user');


var db = require('./config/db');
mongoose.connect(db.url); // connect to our mongoDB data
var port = process.env.PORT || 8080; // set port

require('./config/passport');

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for
app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

var storage = multer.diskStorage({ // multer's disk storage settings
    destination: function (req, file, cb) {
        cb(null, './public/img/pictures')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ // multer settings
    storage: storage
}).single('file');

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
        // use our guest model to find the guest we want
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

router.route('/guests/rsvp')
  .post(function(req, res){
    var query = Guest.findOne({ 'authCode': req.body.authCode }); // find guest with matching auth code
    query.select('authCode'); // selecting the `auth code field

    // execute the query at a later time
    query.exec(function (err, guest) {
      if (err)
        res.send(err);
      Guest.findById(guest._id, function(err, guest1) {
          if (err)
              res.send(err);
          guest1.name = guest1.name;
          guest1.responded = true;
          guest1.numAttending = req.body.numAttending;
          guest1.authCode = req.body.authCode;
          guest1.save(function(err) {
              if (err)
                  res.send(err);
          });
      });
      res.json({ message: 'RSVP completed' });
    })
  });


// PICTURE ROUTES
router.route('/pictures')
    // create an picture (accessed at POST http://localhost:8080/api/pictures)
    .post(function(req, res) {
        var picture = new Picture();      // create a new instance of the picture model
        picture.filename = req.body.filename;
        // save the picture and check for errors
        picture.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Picture created!' });
        });
    })
    // get all the pictures (accessed at GET http://localhost:8080/api/pictures)
    .get(function(req, res) {
        Picture.find(function(err, pictures) {
            if (err)
                res.send(err);
            res.json(pictures);
        });
    });
router.route('/pictures/:picture_id') // Get a picture by its ID
    .get(function(req, res) {
        Picture.findById(req.params.picture_id, function(err, picture) {
            if (err)
                res.send(err);
            res.json(picture);
        });
    })
    .put(function(req, res) {
        Picture.findById(req.params.picture_id, function(err, picture) {
            if (err)
                res.send(err);
            picture.filename = req.body.filename;
            picture.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Picture updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Picture.remove({
            _id: req.params.picture_id
        }, function(err, picture) {
            if (err)
                res.send(err);
            res.json({ message: 'Picture successfully deleted' });
        });
    });


    // announcement ROUTES
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

      // User ROUTES
      router.route('/register')
        .post(function(req, res) {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            user.save(function(err) {
              var token;
              token = user.generateJwt();
              res.status(200);
              res.json({
                "token" : token
              });
            });
        });

      router.route('/login')
        .post(function(req, res) {
          passport.authenticate('local', function(err, user, info){
            console.log(user.email);
            var token;
            // If Passport throws/catches an error
            if (err) {
              res.status(404).json(err);
              return;
            }
            // If a user is found
            if(user){
              token = user.generateJwt();
              res.status(200);
              res.json({
                "token" : token
              });
            } else {
              // If user is not found
              res.status(401).json(info);
            }
          })(req, res);
        });

        router.route('/profile')
          .get(auth, function(req, res) {
             if (!req.payload._id) {
               res.status(401).json({
                 "message" : "UnauthorizedError: private profile"
               });
             } else {
               User
                 .findById(req.payload._id)
                 .exec(function(err, user) {
                   res.status(200).json(user);
                 });
             }
      });

      router.route('/upload')
        .post(function(req, res){
          upload(req,res,function(err){
          if(err){
               res.json({error_code:1,err_desc:err});
               return;
          }
           res.json({error_code:0,err_desc:null,filename:req.file.filename});
          })
        });


// REGISTER ROUTES =========================================================
// all routes will be prefixed with /api
app.use(passport.initialize());
app.use('/api', router);

router.get('*', function(req, res) {
    res.sendfile('./public/index.html', { root: __dirname }); // load our public/index.html file
});


// routes ==================================================
//require('./app/routes')(app); // configure our routes
app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});


function run($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
    });
  }

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('WedApp is live on port ' + port);

// expose app
exports = module.exports = app;
