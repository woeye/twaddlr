/*
 * Setup Socket.IO events
 */

var socketIo = require('socket.io')
        , sessions = {};

module.exports = function(server, redisClient) {

    function checkLogin(login) {
        var result = redisClient.sismember('users:list', login);
        console.log('checkLogin for [' + login + ']: ' + result);
        return !result;
    }

    var io = socketIo.listen(server);

    io.sockets.on('connection', function (socket) {
        socket.emit('connected', {
            msg: 'welcome to twaddlr!'
        });

        socket.on('registration:loginAvailable', function(data) {
            socket.emit('registration:loginAvailableResult', {
                login: data.login,
                available: checkLogin(data.login)
            });
        });

        socket.on('registration:register', function(data) {
            console.log('Registration requested!');
            if (checkLogin(data.login)) {
                console.log('Login available: ' + data.login);
                redisClient.sadd('users:list', data.login);
                redisClient.hmset('users:' + data.login, {
                    login: data.login,
                    password: data.password,
                    email: data.email
                });
                socket.emit('registration:registered', {});
                console.log('New user registered!');
            } else {
                socket.emit('registration:error', "Login already in use");
            }
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
