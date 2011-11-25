var util = require('util'),
	less = require('less'),
	express = require('express'),
	seforms = require('./lib/seforms');

	//api = require('./lib/api');

var PORT = 3000;

//var myApi = new api.SimpleApi();

// Create our server
var app = express.createServer();
var staticDir = __dirname + '/static';

// Configure express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', {
		layout: false
	});
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'dumdidadidum' }));
	//app.use(express.logger());
	app.use(app.router);
	app.use(express.compiler({ src: staticDir, enable: ['less'] }));
	app.use(express.static(staticDir));
});

//app.configure('development', function() {
//	//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//	app.use(express.static(staticDir));
//});

// Install a custom error handler for LESS errors
app.error(function(err, req, res, next) {
	if (err.name && err.name == 'ParseError') {
		console.log(err);
		next();
	} else {
		next(err, req, res);	
	}
});

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

// Ok, let's listen on port 9000
console.log("Starting server on port " + PORT);
app.listen(PORT);