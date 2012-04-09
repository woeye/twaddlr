(function($) {

	var twaddlr = {};

	// Define the Login view
	var LoginView = Backbone.View.extend({
		el: '#main_content',
		template: $('#login-form-template').html(),

		initialize: function() {
		},

		events: {
			"click a.register-link": "showRegisterForm"
		},

		render: function() {
			//console.log(this.$el);
			this.$el.html(Mark.up(this.template, {}));
			this.$el.find('input').inputPimp();
			return this;
		},

		showRegisterForm: function(e) {
			e.preventDefault(); // We must call this or the browser URL will be incorrect

			console.log('showRegisterForm');
			twaddlr.router.navigate('/register', {trigger: true});
		}
	});

	var RegisterView = Backbone.View.extend({
		el: '#main_content',
		template: $('#register-form-template').html(),

		initialize: function() {
		},

		render: function() {
			this.$el.html(Mark.up(this.template, {}));
			this.$el.find('input').inputPimp();
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