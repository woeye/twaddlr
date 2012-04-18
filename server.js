/**
 * Twaddlr - a simple chat server. Inspired by Campfire.
 */

var util = require('util'),
        express = require('express'),
        mongodb = require('mongodb');

var PORT = 3000;

// First try to connect to MongoDB. Without MongoDB there's
// no need to continue ...
//var db = new mongodb.Db('twaddle', new mongodb.Server('127.0.0.1', 27017, {}));
//db.open(function(err, client) {
//    if (err) {
//        console.log("Couldn't connect to MongoDB. Aborting!");
 //       throw err;
 //   }

 //   console.log("Connected to MongoDB! Initializing server ...");

    // Create our server
    var app = express();
    var publicDir = __dirname + '/public';
    var viewsDir = __dirname + '/views';

    // Add mime-type for LESS files
    express.static.mime.define({ 'text/css': ['css', 'less'] });
    console.log(express.static.mime.lookup('less'));

    // Configure express
    app.use(express.bodyParser());
    app.use(express.cookieParser('malabar'));
    app.use(express.session());
    //app.use(express.logger());
    app.use(app.router);
    //app.use(express.compiler({ src: publicDir, enable: ['less'] }));
    app.use(express.static(publicDir));
    
    //app.set('views', viewsDir);
    //app.set('view engine', 'jade');

    
    //app.configure('development', function() {
    //  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    //  app.use(express.static(publicDir));
    //});

    // Setup routes
    //require('./routes/site')(app);
//    require('./routes/rest_api')(app, client);

    // Initialize Socket.IO
    require('./lib/com_hub')(app);

    // Ok, let's listen on port PORT
    console.log("Starting server on port " + PORT);
    app.listen(PORT);
//});

