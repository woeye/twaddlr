/**
 * Twaddlr - a simple chat server. Inspired by Campfire.
 */

var util = require('util'),
    connect = require('connect'),
    http = require('http'),
    redis = require('redis'),
    PORT = 3000;

var twaddlr = {}; // Server state

// Connect to Redis
twaddlr.redisClient = redis.createClient();
twaddlr.redisClient.on('error', function(err) {
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
twaddlr.server = http.createServer(app).listen(PORT);

// Initialize socket.io subsystem
twaddlr.userService = require('./backend/user_service');
twaddlr.userService.init(twaddlr.redisClient);

twaddlr.chatService = require('./backend/chat_service');
twaddlr.chatService.init(twaddlr.redisClient);

twaddlr.comHub = require('./backend/com_hub');
twaddlr.comHub.init(twaddlr.server, twaddlr.redisClient, 
  twaddlr.userService, twaddlr.chatService);

