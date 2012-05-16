/*
 * Setup Socket.IO events
 */

var socketIo = require('socket.io'),
  crypto = require('crypto'),
  util = require('util'),
  sessions = {};

module.exports = function(server, redisClient) {

  function checkUsernameAvailable(username, cb) {
    // redisClient.smembers('users:list', function(err, data) {
    //     console.log('result: ', data);
    // });
    console.log('checkUsernameAvailable for: ' + username);
    var result = redisClient.sismember('users:list', username, function(err, data) {
      console.log('sismember -> ', data);
      cb(err, data);
    });
  }

  var io = socketIo.listen(server);

  io.sockets.on('connection', function (socket) {
    socket.join('lounge');
    socket.emit('connected', {
      msg: 'welcome to twaddlr!'
    });

    socket.on('registration:usernameAvailable', function(data) {
      var username = data.username;
      checkUsernameAvailable(username, function(err, data) {
        socket.emit('registration:usernameAvailableResult', {
          username: username,
          available: data === 0 ? true : false
        });
      });
    });

    socket.on('registration:register', function(data) {
      console.log('Registration requested!');
      var username = data.username;
      var password = data.password;
      var email = data.email;

      if (username && password && email) {
        checkUsernameAvailable(username, function(err, result) {
          if (result === 0) {
            console.log('Username available! Creating user: ' + username);

            // Create a SHA1 token
            var shasum = crypto.createHash('sha1');
            shasum.update(username + password + email);
            var token = shasum.digest('hex');
            console.log('Created token: ' + token);

            redisClient.sadd('users:list', username);
            redisClient.hmset('users:' + username, {
              username: username,
              password: password,
              email: email,
              token: token
            });
            socket.emit('registration:registered', {
              usernane: username,
              token: token
            });
            console.log('New user registered!');
          } else {
            socket.emit('registration:error', {
              error: 'usernameAlreadyInUse'
            });
          }
        });                
      } else {
        console.log('Missing data for registration process');
        console.log('Data received: ', data);
        socket.emit('registration:error', {
          error: 'missingData'
        });
      }
    });

    socket.on('login:login', function(data) {
      if (data.username && data.password) {
        console.log("Login requested for user: " + data.username);
        redisClient.hgetall('users:' + data.username, function(err, obj) {
          if (obj === null) {
            console.log("Unknown username!");
            socket.emit('login:error', {
              error: 'invalidUsername',
              username: data.username
            });
          } else {
            if (obj.password != data.password) {
              console.log("Invalid password!");
              socket.emit('login:error', {
                error: 'invalidPassword'
              });
            } else {
              console.log("Username logged in successfully!");
              socket.username = obj.username;
              socket.token = obj.token;
              socket.emit('login:done', {
                token: obj.token
              });
            }
          }
        });
      } else {
        console.log("Missing data!");
        socket.emit('login:error', {
          error: 'missingData'
        });
      }
    });

    socket.on('login:verifyToken', function(data) {
      if (data.username && data.token) {
        redisClient.hgetall('users:' + data.username, function(err, obj) {
          if (obj && obj.token == data.token) {
            socket.emit('login:verifyTokenSucceeded');
            return;
          }
        });
      }
      socket.emit('login:verifyTokenFailed');
    });

    socket.on('login:reconnect', function(data) {
      console.log("Client reconnect attempt");
      console.log(util.inspect(data));

      socket.username = data.username;
      socket.token = data.token;
    });

    socket.on('chat:message', function(data) {
      console.log("[" + socket.username + "]: " + data.message);
      io.sockets.emit('chat:message', {
        username: socket.username,
        timestamp: Date.now(),
        message: data.message
      });
      // socket.broadcast.to('lounge').emit('chat:message', {
      //   username: socket.username,
      //   timestamp: Date.now(),
      //   message: data.message
      // });
    });
  });
};
