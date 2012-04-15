(function(twaddlr) {

    // Define the login view
    var LoginView = Backbone.View.extend({
        className: 'login-view',
        //el: '#login-view',
        //template: $('#login-form-template').html(),

        initialize: function() {
        },

        events: {
            'click a': 'showRegisterForm',
            'submit form': 'doLogin'
        },

        render: function() {
            console.log('render');
            $('#main-content').empty().append(this.$el);
            this.$el.html(twaddlr.templates['login-template']);
            this.$el.find('input').inputPimp();
            return this;
        },

        showRegisterForm: function(e) {
            e.preventDefault(); // We must call this or the browser URL will be incorrect

            console.log('showRegisterForm');
            twaddlr.router.navigate('/register', {trigger: true});
        },

        doLogin: function(e) {
            e.preventDefault();
            alert('not implemented yet :/');
        }
    });

    // Define the register view
    var RegisterView = Backbone.View.extend({
        className: 'register-view',
        //el: '#register-view',
       // template: $('#register-form-template').html(),

        initialize: function() {
        },

        events: {
            'click a': 'showLoginForm',
            'submit form': 'doRegister'
        },

        render: function() {
            $('#main-content').empty().append(this.$el);
            this.$el.html(twaddlr.templates['register-template']);
            this.$el.find('input').inputPimp();
            return this;
        },

        showLoginForm: function(e) {
            e.preventDefault();

            twaddlr.router.navigate('/login', {trigger:true});
        },

        doRegister: function(e) {
            e.preventDefault();
            //alert('not implemented yet :/');
            var data = {
                username: this.$el.find('#username').val(),
                password: this.$el.find('#password').val(),
                email: this.$el.find('#email').val()
            };
            //console.log(data);

            // TODO: Proper error handling ;)
            $.ajax({
                type: 'POST',
                url: '/api/register',
                data: data
            }).done(function(response) {
                console.log(response);
            });
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
            new LoginView().render();
        },

        register: function() {
            console.log('router -> register');
            new RegisterView().render();
        }
    });

    twaddlr.run = function() {
        // Initialize templates first and initialize app afterwards
        twaddlr.templates = {};
        $('script[type="text/x-handlebars-template"]').each(function() {
            //console.log($(this).attr('id'));
            //console.log($(this).html());
            twaddlr.templates[$(this).attr('id')] = Handlebars.compile($(this).html());
        });
        console.log('All templates initialized!');

        twaddlr.router = new AppRouter();
        Backbone.history.start();
        twaddlr.router.navigate('register', {trigger: true, replace: true});
    };

})(twaddlr);