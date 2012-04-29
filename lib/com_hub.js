/*
 * Setup Socket.IO events
 */

var socketIo = require('socket.io')
    , sessions = {};

module.exports = function(server) {

  var io = socketIo.listen(server);

  io.sockets.on('connection', function (socket) {
    socket.emit('connected', {
      msg: 'welcome to twaddlr!'
    });

    socket.on('login', function(data) {
      console.log('performing login:', data);

      socket.emit('login:done', {
        token: '1234'
      });
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
