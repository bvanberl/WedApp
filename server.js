// MODULES =================================================
var express        = require('express');
var app            = express();
var nconf       = require('nconf');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var path           = require('path');
var cookieParser   = require('cookie-parser');
var passport       = require('passport');
var jwt            = require('express-jwt');
var multer         = require('multer');
var request        = require('request');
var fs             = require('fs');
var thumb          = require('node-thumbnail').thumb;
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

// COLLECTIONS ================================================
var Guest     = require('./app/models/guest');
var Inn     = require('./app/models/inn');
var Picture     = require('./app/models/picture');
var User     = require('./app/models/user');
var Song     = require('./app/models/song');
var GlobalVariable     = require('./app/models/global-var');

nconf.argv().env().file('keys.json');
const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const dbPort = nconf.get('mongoPort');
const databaseName = nconf.get('mongoDatabase');

let uri = `mongodb://${user}:${pass}@${host}:${dbPort}`;
if (databaseName) {
  uri = `${uri}/${databaseName}`;
}
var db = require('./config/db');
mongoose.connect(uri, function(err) {
    if (err) {
      console.log(err);
      throw err;
    }
});
var port = process.env.PORT || 8080; // set port

require('./config/passport');

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for
app.use('/images', express.static(__dirname + '/public/img'));
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

// LastFM API settings
let Last_FM_key = "78d80b1fa2290b123156b11ab7f86c24";
let Last_FM_shared_secret = "9bf1a9f0fe856e3d479a5cddbf6c80f2";
let Last_FM_user = "bpavb11";

var router = express.Router();

// GUESTS ROUTES ===================================================================================================================
router.route('/guests')
    // create a guest (accessed at POST http://localhost:8080/api/guests)
    .post(function(req, res) {
        var guest = new Guest();      // create a new instance of the Guest model
        guest.name = req.body.name;
        guest.responded = req.body.responded;
        guest.numAdults = req.body.numAdults;
        guest.numChildren = req.body.numChildren;
        guest.numChildrenMeals = req.body.numChildrenMeals;
        guest.numVegMeals = req.body.numVegMeals;
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
            guest.numAdults = req.body.numAdults;
            guest.numChildren = req.body.numChildren;
            guest.numChildrenMeals = req.body.numChildrenMeals;
            guest.numVegMeals = req.body.numVegMeals;
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
      Guest.findOne({ 'authCode': req.body.authCode }, function(err, guest1) {
          if (err || guest1 == null)
              res.json({message: 'Error'});
          else {
            guest1.name = guest1.name;
            guest1.isAttending = guest1.isAttending;
            guest1.responded = true;
            guest1.numAdults = req.body.numAdults;
            guest1.numChildren = req.body.numChildren;
            guest1.numChildrenMeals = req.body.numChildrenMeals;
            guest1.numVegMeals = req.body.numVegMeals;
            guest1.authCode = req.body.authCode;
            guest1.save(function(err) {
                if (err)
                    res.json({ message: err});
                    return;
            });
            res.json({ message: 'SUCCESS' });
          }
  });
});


// PICTURE ROUTES
router.route('/pictures')
    // create an picture (accessed at POST http://localhost:8080/api/pictures)
    .post(function(req, res) {
        var picture = new Picture();      // create a new instance of the picture model
        picture.filename = req.body.filename;
        picture.thumbFilename = picture.filename.replace('.','_thumb.');
        picture.save(function(err) {
            if (err)
                res.send(err);
            if(picture.filename){
              thumb({
                source: './public/img/pictures/' + picture.filename,
                destination: './public/img/thumbnails/',
                width: 200
              }).then(function() {
                console.log('Thumbnail created.');
                res.json({ message: 'Picture created!' });
              }).catch(function(e) {
                console.log('Error', e.toString());
              });
            }
        });
        // Create thumbnail image

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
            picture.thumbFilename = picture.thumbFilename;
            picture.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Picture updated!' });
            });
        });
    })
    .delete(function(req, res) {
       // Delete the picture, then its thumbnail.
       Picture.findById(req.params.picture_id, function(err, picture) {
           if (err)
             res.send(err);
           fs.unlink('./public/img/pictures/' + picture.filename, function(err) {
             if(err)
               console.log(err);
           });
           fs.unlink('./public/img/thumbnails/' + picture.thumbFilename, function(err) {
             if(err)
               console.log(err);
           });
           // Remove the picture entry from the database.
           Picture.remove({
               _id: req.params.picture_id
           }, function(err, picture) {
               if (err)
                   res.send(err);
           });
           res.json({ message: 'Picture successfully deleted' });
       });
    });


    // inn ROUTES
    router.route('/inns')
        // create an inn (accessed at POST http://localhost:8080/api/inns)
        .post(function(req, res) {
            var inn = new Inn();      // create a new instance of the inn model
            inn.name = req.body.name;
            inn.address = req.body.address;
            inn.phoneNumber = req.body.phoneNumber;
            inn.url = req.body.url;
            // save the inn and check for errors
            inn.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Inn created!' });
            });
        })
        // get all the inns (accessed at GET http://localhost:8080/api/inns)
        .get(function(req, res) {
            Inn.find(function(err, inns) {
                if (err)
                    res.send(err);
                res.json(inns);
            });
        });
    router.route('/inns/:inn_id') // Get a inn by his/her ID
        .get(function(req, res) {
            Inn.findById(req.params.inn_id, function(err, inn) {
                if (err)
                    res.send(err);
                res.json(inn);
            });
        })
        .put(function(req, res) {
            Inn.findById(req.params.inn_id, function(err, inn) {
                if (err)
                    res.send(err);
                inn.name = req.body.name;
                inn.address = req.body.address;
                inn.phoneNumber = req.body.phoneNumber;
                inn.url = req.body.url;
                inn.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({ message: 'Inn updated!' });
                });
            });
        })
        .delete(function(req, res) {
            Inn.remove({
                _id: req.params.inn_id
            }, function(err, inn) {
                if (err)
                    res.send(err);
                res.json({ message: 'Inn successfully deleted' });
            });
        });

        // Global Variable ROUTES
        router.route('/global-vars')
            // create an globalVariable (accessed at POST http://localhost:8080/api/global-vars)
            .post(function(req, res) {
                var globalVariable = new GlobalVariable();      // create a new instance of the globalVariable model
                globalVariable.identifier = req.body.identifier;
                var hashedValue = crypto.createHash('sha256').update(req.body.value).digest('base64');
                globalVariable.value = hashedValue;
                // save the globalVariable and check for errors
                globalVariable.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({ message: 'globalVariable created!' });
                });
            })
            // get all the globalVariables (accessed at GET http://localhost:8080/api/global-vars)
            .get(function(req, res) {
                GlobalVariable.find(function(err, globalVariables) {
                    if (err)
                        res.send(err);
                    res.json(globalVariables);
                });
            });
        router.route('/global-vars/:globalVariableIdentifier') // Get a globalVariable by his/her ID
            .get(function(req, res) {
                GlobalVariable.findById(req.params.globalVariableIdentifier, function(err, globalVariable) {
                    if (err)
                        res.send(err);
                    res.json(globalVariable);
                });
            })
            .put(function(req, res) {
                GlobalVariable.findOne({ 'identifier': req.params.globalVariableIdentifier}, function(err, globalVariable) {
                    if (err)
                        res.send(err);
                    globalVariable.value = req.body.value;
                    globalVariable.save(function(err) {
                        if (err)
                            res.send(err);
                        res.json({ message: 'globalVariable updated!' });
                    });
                });
            })
            .delete(function(req, res) {
                GlobalVariable.remove({
                    identifier: req.params.globalVariableIdentifier
                }, function(err, globalVariable) {
                    if (err)
                        res.send(err);
                    res.json({ message: 'globalVariable successfully deleted' });
                });
            });

        // Song ROUTES
        router.route('/songs')
            // create an song (accessed at POST http://localhost:8080/api/songs)
            .post(function(req, res) {
                Song.find({name: req.body.name, artist: req.body.artist}, function(err, docs) {
                    if (!docs.length) {
                      var song = new Song();      // create a new instance of the song model
                      song.name = req.body.name;
                      song.artist = req.body.artist;
                      song.noRequests = 1;
                      // save the song and check for errors
                      song.save(function(err) {
                          if (err)
                              res.send(err);
                          res.json({ message: 'song created!' });
                      });
                    }
                    else {
                      Song.findById(docs[0]._id, function(err, song) {
                          if (err)
                              res.send(err);
                          song.noRequests = song.noRequests + 1; // Increment song requests
                          song.save(function(err) {
                              if (err)
                                  res.send(err);
                              res.json({ message: 'song updated!' });
                          });
                      });
                    }
                });

            })
            // get all the songs (accessed at GET http://localhost:8080/api/songs)
            .get(function(req, res) {
                Song.find(function(err, songs) {
                    if (err)
                        res.send(err);
                    res.json(songs);
                });
            });
        router.route('/songs/:song_id') // Get a song by its ID
            .get(function(req, res) {
                Song.findById(req.params.song_id, function(err, song) {
                    if (err)
                        res.send(err);
                    res.json(song);
                });
            })
            .put(function(req, res) {
                // use our bear model to find the bear we want
                Song.findById(req.params.song_id, function(err, song) {
                    if (err)
                        res.send(err);
                    song.name = req.body.name;
                    song.artist = req.body.artist;
                    song.save(function(err) {
                        if (err)
                            res.send(err);
                        res.json({ message: 'song updated!' });
                    });
                });
            })
            .delete(function(req, res) {
                Song.remove({
                    _id: req.params.song_id
                }, function(err, song) {
                    if (err)
                        res.send(err);
                    res.json({ message: 'song successfully deleted' });
                });
            });

      // Song search
      router.route('/songsearch/:searchtype/:keywords')
        .get(function(req, res) {
          var data = [];
          if(req.params.searchtype == "artist") {
            // Query Last FM for top tracks by an artist
            request('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + req.params.keywords + '&api_key=' + Last_FM_key + '&format=json', { json: true }, (error, response, body) => {
              if (error) { return console.log(error); }
              if(response.body.toptracks != undefined){
                var raw_data = response.body.toptracks.track;
                for(var i = 0; i < raw_data.length; i++){
                  var regex = new RegExp('"', 'g');
                  var song_name = raw_data[i].name.replace(regex,"'");
                  var artist_name =  raw_data[i].artist.name.replace(regex,"'");
                  var song = '{"name":"' + song_name + '","artist":"' + artist_name + '"}';
                  data.push(JSON.parse(song));
                }
              }
              res.status = 200;
              res.json({
                "results":data
              });
            });
          }
          else if(req.params.searchtype == "track") {
            // Query Last FM for song
            request('http://ws.audioscrobbler.com/2.0/?method=track.search&track=' + req.params.keywords + '&api_key=' + Last_FM_key + '&format=json', { json: true }, (error, response, body) => {
              if (error) { return console.log(error); }
              var raw_data = response.body.results.trackmatches.track;
              for(var i = 0; i < raw_data.length; i++){
                var regex = new RegExp('"', 'g');
                var song_name = raw_data[i].name.replace(regex,"'");
                var artist_name =  raw_data[i].artist.replace(regex,"'");
                var song = '{"name":"' + song_name + '","artist":"' + artist_name + '"}';
                data.push(JSON.parse(song));
              }
              res.status = 200;
              res.json({
                "results":data
              });
            });
          }

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
          if(req.file){
            res.json({error_code:0,err_desc:null,filename:req.file.filename});
          }
          else {
            res.json({error_code:1});
          }
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
      if ($location.path() !== '/profile' && !authentication.isLoggedIn()) {
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
