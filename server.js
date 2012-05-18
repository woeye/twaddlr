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

// Configure express
app.use(connect.cookieParser('malabar'));
app.use(connect.session());
app.use(connect.static(publicDir));

// Ok, let's listen on port PORT
console.log("Starting server on port " + PORT);
var server = http.createServer(app).listen(PORT);

// Initialize socket.io subsystem
require('./lib/com_hub')(server, redisClient);
