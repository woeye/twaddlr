/*
 * Setup Socket.IO events
 */

var util = require('util'),
    MessageDispatcher = require('./message_dispatcher'),
    sessions = {};

module.exports = new ComHub();

function ComHub() {

}

ComHub.prototype.init = function(server, redisClient, userService, chatService) {
  this.server = server;
  this.redisClient = redisClient;
  this.userService = userService;
  this.chatService = chatService;

  var dispatcher = new MessageDispatcher(server);
  dispatcher.on('connection', function(con) {
    con.send('connection:welcome', {
      msg: 'welcome to twaddlr!'
    });

    con.on('registration:usernameAvailable', function(msg) {
      var username = msg.username;
      userService.checkUsernameAvailable(username, function(result) {
        con.send('registration:usernameAvailableResult', {
          username: username,
          available: result
        });
      });
    });

    con.on('registration:register', function(msg) {
      console.log("Registration requested!");
      var username = msg.username;
      var password = msg.password;
      var email = msg.email;

      if (username && password && email) {
        userService.register(username, password, email, function(err, token) {
          if (err) {
            con.send('registration:error', {
              error: err
            });
          } else {
            con.send('registration:registered', {
              usernane: username,
              token: token
            });
          }
        });
      } else {
        console.log("Missing data for registration process");
        console.log("Message received: ", msg);
        con.send('registration:error', {
          error: 'missingData'
        });
      }  
    });

    con.on('login:login', function(msg) {
      if (msg.username && msg.password) {
        userService.login(msg.username, msg.password, function(err, token) {
          if (err) {
            con.send('login:error', {
              error: err.code
            });
          } else {
            con.username = msg.username;
            con.token = token;
            con.send('login:done', {
              token: token
            });
          }
        });
      } else {
        console.log("Missing data!");
        con.send('login:error', {
          error: 'missingData'
        });
      }
    });

    con.on('login:reauthenticate', function(msg) {
      console.log("Client reauhthentication attempt");
      console.log(util.inspect(msg));
      if (msg.username && msg.token) {
        redisClient.hgetall('users:' + msg.username, function(err, obj) {
          if (obj && obj.token == msg.token) {
            con.username = msg.username;
            con.token = obj.token;
            con.send('login:reauthenticationSucceeded');
          } else {
            con.send('login:reauthenticationFailed');
          }
        });
      }
    });

    con.on('chat:history', function(msg) {
      var messages = [];
      redisClient.zrange('messages:history', -10, -1, function(err, results) {
        if (err) {
          console.log("Couldn't load history: " + util.inspect(err));
        } else {
          results.forEach(function(msg) {
            messages.push(JSON.parse(msg));
          });
          con.send('chat:historyResult', messages);
        }
      });
    });

    con.on('chat:message', function(msg) {
      console.log("[" + con.username + "]: " + msg.message);
  
      // Persist message in redis
      var chatMsg = {
        username: con.username,
        timestamp: Date.now(),
        message: msg.message
      };
      redisClient.zadd('messages:history', chatMsg.timestamp, JSON.stringify(chatMsg));
      dispatcher.broadcast('chat:message', chatMsg);
    });

  });


};



/*


    socket.on('login:verifyToken', function(data) {
      if (data.username && data.token) {
        redisClient.hgetall('users:' + data.username, function(err, obj) {
          if (obj && obj.token == data.token) {
            socket.emit('login:verifyTokenSucceeded');
          } else {
            socket.emit('login:verifyTokenFailed');
          }
        });
      }
    });



    socket.on('chat:history', function(data) {
    });

  });
};
*/