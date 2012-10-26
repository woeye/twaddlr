//
// UserService
//

var crypto = require('crypto');

module.exports = new UserService();

function UserService() {

}

UserService.prototype.init = function(redisClient) {
  this.redisClient = redisClient;
};

UserService.prototype.checkUsernameAvailable = function(username, callback) {
  // redisClient.smembers('users:list', function(err, data) {
  //     console.log('result: ', data);
  // });
  console.log('checkUsernameAvailable for: ' + username);
  var result = this.redisClient.sismember('twaddlr.users:list', username, function(err, data) {
    console.log('sismember -> ', data);
    callback(data === 0 ? true : false);
  });
};

UserService.prototype.register = function(username, password, email, callback) {
  this.checkUsernameAvailable(username, function(result) {
    if (result === false) {
      callback("Username already in use");
    } else {
      console.log('Username available! Creating user: ' + username);

      // Create a SHA1 token
      var shasum = crypto.createHash('sha1');
      shasum.update(username + password + email);
      var token = shasum.digest('hex');
      console.log('Created token: ' + token);

      this.redisClient.sadd('twaddlr.users:list', username);
      this.redisClient.hmset('twaddlr.users:' + username, {
        username: username,
        password: password,
        email: email,
        token: token
      });
    
      callback(null, token);
      console.log('New user registered!');
    } 
  }.bind(this));                
};

UserService.prototype.login = function(username, password, callback) {
  console.log("Login requested for user: " + username);
  this.redisClient.hgetall('twaddlr.users:' + username, function(err, obj) {
    if (obj === null) {
      console.log("Unknown username!");
      var e = new Error("Unknown username");
      e.code = 'unknownUsername';
      callback(e);
    } else {
      if (obj.password != password) {
        console.log("Invalid password!");
        var e = new Error("Invalid password");
        e.code = 'invalidPassword';
        callback(e);
      } else {
        console.log("Username logged in successfully!");
        callback(null, obj.token);
      }
    }
  });
};