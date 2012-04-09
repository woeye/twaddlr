/*
 * Routes for the REST API
 */

var mongodb = require('mongodb');

module.exports = function(app, client) {
  app.get('/api/login', function(req, res) {

  });

  app.get('/api/userinfo/:username', function(req, res) {

  });

  app.post('/api/register', function(req, res) {
    console.log('Registration requested: ' + req);
    var username = req.body.username;

    // Is the username available?
    var users = new mongodb.Collection(client, 'users');
    console.log("Verifying username: "+ username);
    users.count({
      username: username
    }, function(err, count) {
      console.log(count);
      if (count > 0) {
        console.log("Username already in use!");
        res.statusCode = 409;
        res.send("username already in use: " + username);
      } else {
        console.log("Username available!");
        res.send("user created: " + username);
        // save
      }
    })
  });
};