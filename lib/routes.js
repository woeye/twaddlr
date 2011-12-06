/*
 * General public routes
 */

var seforms = require('./seforms');

module.exports = function(app) {

	function restricted(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			req.session.error = 'Access denied!';
			res.redirect('/login');
		}
	}

	// Configure our routes
	app.get('/', function(req, res) {
		var form = seforms.createForm({
			cssClass: 'fancy',
			fields: [
				{label: 'Login', name: 'login', type: 'textField'},
				{label: 'Password', name: 'password', type: 'passwordField'},
			]
		});
		res.render('index.jade', {
			form: form
		});
	});

	app.get('/login', function(req, res) {
		res.render('login.jade');
	});

};