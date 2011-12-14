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
			class: 'fancy',
			rowClass: 'row',
			fields: [
				{name: 'login', label: 'Login', type: 'text'},
				{name: 'password', label: 'Password', type: 'password'},
				{name: 'submitButton', label: 'Login', type: 'submit'}
			]
		});
		res.render('index.jade', { form: form	});
	});

	app.get('/login', function(req, res) {
		res.render('login.jade');
	});

};