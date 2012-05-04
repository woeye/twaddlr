/*
 * Setup Socket.IO events
 */

var socketIo = require('socket.io')
        , sessions = {};

module.exports = function(server, redisClient) {

    function isLoginInUse(login, cb) {
        // redisClient.smembers('users:list', function(err, data) {
        //     console.log('result: ', data);
        // });
        console.log('checkLogin for: ' + login);
        var result = redisClient.sismember('users:list', login, function(err, data) {
            console.log('sismember -> ', data);
            cb(err, data);
        });
    }

    var io = socketIo.listen(server);

    io.sockets.on('connection', function (socket) {
        socket.emit('connected', {
            msg: 'welcome to twaddlr!'
        });

        socket.on('registration:loginAvailable', function(data) {
            var login = data.login;
            isLoginInUse(login, function(err, data) {
                socket.emit('registration:loginAvailableResult', {
                    login: login,
                    available: data == 0 ? true : false
                });
            });
        });

        socket.on('registration:register', function(data) {
            console.log('Registration requested!');
            var login = data.login;
            var password = data.password;
            var email = data.email;
            isLoginInUse(login, function(err, result) {
                if (result == 0) {
                    console.log('Login available! Creating user: ' + login);
                    redisClient.sadd('users:list', login);
                    redisClient.hmset('users:' + login, {
                        login: login,
                        password: password,
                        email: email
                    });
                    socket.emit('registration:registered', {});
                    console.log('New user registered!');
                } else {
                    socket.emit('registration:error', {
                        error: 'loginAlreadyInUse'
                    });
                }
            });
        });

        socket.on('login:login', function(data) {
            console.log('performing login:', data);
            socket.nickname = data.login;
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
