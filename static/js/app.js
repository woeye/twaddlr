(function($) {

	var twaddlr = {};

	// Define the Login view
	var LoginView = Backbone.View.extend({
		el: '#main_content',

		initialize: function() {
		},

		events: {
			"click a.register-link": "showRegisterForm"
		},

		render: function() {
			//console.log(this.$el);

			var tmpl = $('#login-form-template');
			this.$el.html(Mark.up(tmpl.html(), {}));
		},

		showRegisterForm: function(e) {
			e.preventDefault(); // We must call this or the browser URL will be incorrect

			console.log('showRegisterForm');
			twaddlr.router.navigate('/register', {trigger: true});
		}
	});

	var RegisterView = Backbone.View.extend({
		el: '#main_content',

		initialize: function() {
		},

		render: function() {
			var tmpl = $('#register-form-template');
			this.$el.html(Mark.up(tmpl.html(), {}));
			return this;
		}
	});

	// Define the main router
	var AppRouter = Backbone.Router.extend({
		routes: {
			"login": "login",
			"register": "register"
		},

		login: function() {
			console.log('router -> login');
			twaddlr.appView.render();
		},

		register: function() {
			console.log('router -> register');
			new RegisterView().render();
		}
	});

	twaddlr.init = function() {
		twaddlr.router = new AppRouter();
		twaddlr.appView = new LoginView();
		Backbone.history.start();
		twaddlr.router.navigate('login', {trigger: true, replace: true});
	};
	twaddlr.init();

})(jQuery);