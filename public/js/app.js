// Our global app object
var twaddlr = {};

(function(twaddlr) {

    // Init
    twaddlr.views = {};
    twaddlr.templates = {};

    // Inject Backbone Events into twaddlr
    _.extend(twaddlr, Backbone.Events);

    twaddlr.on('twaddlr:showLoginView', function() {
        twaddlr.router.navigate('/login', {trigger:true});
    });

    twaddlr.on('twaddlr:showRegisterView', function() {
        twaddlr.router.navigate('/register', {trigger:true});
    });

    // Define the main router
    var AppRouter = Backbone.Router.extend({
        routes: {
            "login": "login",
            "register": "register"
        },

        login: function() {
            console.log('router -> login');
            new twaddlr.views.LoginView().render();
        },

        register: function() {
            console.log('router -> register');
            new twaddlr.views.RegisterView().render();
        }
    });
    twaddlr.router = new AppRouter();

    twaddlr.start = function() {
        // Precompile the handlebar templates
        $('script[type="text/x-handlebars-template"]').each(function() {
            twaddlr.templates[$(this).attr('id')] = Handlebars.compile($(this).html());
        });
        console.log('Compiles all templates ...');

        Backbone.history.start();
        twaddlr.router.navigate('register', {trigger: true, replace: true});
    };

})(twaddlr);

// One the document is ready start the app
$(document).ready(function() {
    twaddlr.start();
});
