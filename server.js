/**
 * Twaddlr - a simple chat server. Inspired by Campfire.
 */

var util = require('util'),
    connect = require('connect'),
    http = require('http'),
    redis = require('redis'),
    PORT = 3000;

// Connect to Redis
var redisClient = redis.createClient();
redisClient.on('error', function(err) {
    console.log("Couldn't connect to redis: " + err);
    process.exit(1);
});


// Create our server
var app = connect();
var publicDir = __dirname + '/public';

// Add mime-type for LESS files
//express.static.mime.define({ 'text/css': ['css', 'less'] });
//console.log(express.static.mime.lookup('less'));

// Configure express
app.use(connect.cookieParser('malabar'));
app.use(connect.session());
//app.use(express.logger());
//app.use(app.router);
//app.use(express.compiler({ src: publicDir, enable: ['less'] }));
app.use(connect.static(publicDir));

//app.use(express.basicAuth)

//app.set('views', viewsDir);
//app.set('view engine', 'jade');


//app.configure('development', function() {
//  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//  app.use(express.static(publicDir));
//});

// Setup routes
//require('./routes/site')(app);
//require('./routes/rest_api')(app, null);

// Ok, let's listen on port PORT
console.log("Starting server on port " + PORT);
//var server = app.listen(PORT);
var server = http.createServer(app).listen(PORT);

// Initialize socket.io subsystem
require('./lib/com_hub')(server, redisClient);


//});

