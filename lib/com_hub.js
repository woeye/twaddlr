/*
 * Setup Socket.IO events
 */

var socketIo = require('socket.io')
        , sessions = {};

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
        socket.emit('connected', {
            msg: 'welcome to twaddlr!'
        });

        socket.on('registration:usernameAvailable', function(data) {
            var username = data.username;
            checkUsernameAvailable(username, function(err, data) {
                socket.emit('registration:usernameAvailableResult', {
                    username: username,
                    available: data == 0 ? true : false
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
                    if (result == 0) {
                        console.log('Username available! Creating user: ' + username);
                        redisClient.sadd('users:list', username);
                        redisClient.hmset('users:' + username, {
                            username: username,
                            password: password,
                            email: email
                        });
                        socket.emit('registration:registered', {});
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
            console.log('performing login:', data);
            socket.username = data.username;
            socket.emit('login:done', {
                token: '1234'
            });


            //socket.set('nickname', data.login, function() {
            //    socket.emit('login:done', {
            //        token: '1234'
            //    });
            //});
        });

        socket.on('msg', function (data) {
            var auth_handle = data.auth_handle;
            user = sessions[auth_handle];
            socket.emit('msg', {
                username: user.username,
                msg: data.msg
            });
        });
    });
};
