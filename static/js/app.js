(function($) {

    var twaddlr = {};

    // Define the login view
    var LoginView = Backbone.View.extend({
        className: 'login-view',
        //el: '#login-view',
        //template: $('#login-form-template').html(),

        initialize: function() {
        },

        events: {
            'click a.register-link': 'showRegisterForm',
            'submit form': 'doLogin'
        },

        render: function() {
            console.log('render');
            $('#main-content').empty().append(this.$el);
            this.$el.html(twaddlr.templates['login.jade']);
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
            'click a.login-link': 'showLoginForm',
            'submit form': 'doRegister'
        },

        render: function() {
            $('#main-content').empty().append(this.$el);
            this.$el.html(twaddlr.templates['register.jade']);
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

            $.ajax({
                type: 'POST',
                url: '/api/register',
                data: {
                    username: 'lars',
                    password: 'mimimimimi',
                    email: 'lars.hoss@gmail.com'
                }
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

    twaddlr.router = new AppRouter();

    // Load templates and initialize app afterwards
    twaddlr.templates = {};

    function loadTemplate(file) {
        return $.get('/views/' + file, function(txt) {
            console.log('template <' + file + '> loaded');
            twaddlr.templates[file] = jade.compile(txt, {compileDebug: false});
        }, 'html');
    }

    // var ops = _.map(['login.jade', 'register.jade'], function(file) {
    //     return $.get('/views/' + file, function(txt) {
    //         console.log('template <' + file + '> loaded');
    //         twaddlr.templates[file] = jade.compile(txt, {compileDebug: false});
    //     }, 'html');
    // });
    // $.when.apply(null, ops).then(function() {

    $.when(
        loadTemplate('login.jade'),
        loadTemplate('register.jade')
    ).then(function() {
        console.log('All templates loaded!');
        Backbone.history.start();
        twaddlr.router.navigate('register', {trigger: true, replace: true});
    });

})(jQuery);