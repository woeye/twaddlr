/*
 * Routes for the REST API
 */

var userManager = require('../lib/managers/user_manager');

var mongodb = require('mongodb');
var express = require('express');

module.exports = function(app, client) {

    function basicAuthCheck(user, pass) {
        console.log('checking: ' + user);
        return true;    
    }

    app.post('/api/login', function(req, res) {
        var login = req.body.username;
        var pw = req.body.password;
        var token = userManager.login(login, pw);
        res.send(token);
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
                // get username and password
                // hash password
                // save
            }
        })
    });
};