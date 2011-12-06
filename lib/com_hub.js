/*
 * Setup Socket.IO events
 */

var socket_io = require('socket.io'),
    sessions = {};

module.exports = function(app) {

	var io = socket_io.listen(app);

	io.sockets.on('connection', function (socket) {

		socket.emit('welcome', {
			msg: 'welcome to twaddle. please identify yourself'
		});

		socket.on('authorize', function(data) {
			var auth_handle = data.auth_handle;
			console.log('verifing auth_handle: ' + auth_handle);
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
