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
		var form = new seforms.Form({
			class: 'fancy',
			rowClass: 'row',
			fields: [
				new seforms.TextField('Login', { value: 'moo'}),
				new seforms.PasswordField('Password'),
				new seforms.SubmitButton('Login')
			]
		});
		res.render('index.jade', { form: form	});
	});

	app.get('/login', function(req, res) {
		res.render('login.jade');
	});

};