(function($) {

    var twaddlr = {};

    // Define the Login view
    var LoginView = Backbone.View.extend({
        el: '#main_content',
        //template: $('#login-form-template').html(),

        initialize: function() {
        },

        events: {
            'click a.register-link': 'showRegisterForm'
        },

        render: function() {
            //console.log(this.$el);
            //this.$el.html(Mark.up(this.template, {}));
            console.log('rendering ...');
            this.$el.html(twaddlr.templates['login.jade']);
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
       // template: $('#register-form-template').html(),

        initialize: function() {
        },

        events: {
            'click a.login-link': 'showLoginForm'
        },

        render: function() {
            //this.$el.html(Mark.up(this.template, {}));
            this.$el.html(twaddlr.templates['register.jade']);
            this.$el.find('input').inputPimp();
            return this;
        },

        showLoginForm: function(e) {
            e.preventDefault();

            twaddlr.router.navigate('/login', {trigger:true});
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

    twaddlr.router = new AppRouter();
    twaddlr.appView = new LoginView();

    // Load templates and initialize app afterwards
    twaddlr.templates = {};
    async.forEach(
        ['login.jade', 'register.jade'], 
        function(file, callback) {
            var tmpl = $.get('/views/' + file, function(txt) {
                console.log('template <' + file + '> loaded');
                twaddlr.templates[file] = jade.compile(txt, {compileDebug: false});
                callback();
            }, 'html');
        },
        function(err) {
            console.log('Template loading complete!');
            Backbone.history.start();
            twaddlr.router.navigate('login', {trigger: true, replace: true});
        }
    );

})(jQuery);