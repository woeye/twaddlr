// Our global app object
var twaddlr = {};

(function(twaddlr) {

    Backbone.View.prototype.show = function() {
        //$('#main-content').empty().append(this.$el);
    };

    Backbone.View.prototype.hide = function() {
        //$('#main-content').empty();
        //this.undelegateEvents();
    }

    // Init
    twaddlr.views = {};
    twaddlr.templates = {};
    twaddlr.currentView = false;

    function showView(view) {
        if (twaddlr.currentView) {
            $('#main-content').animate({
                opacity: 0.0
            }, 100, 'ease-out', function() {
                console.log('ease-out done');
                $('#main-content').empty().append(view.render().$el);
                twaddlr.currentView = view;
                $('#main-content').animate({
                    opacity: 1.0
                }, 100, 'ease-in', function() {
                    console.log('ease-in done');
                });
            });
        } else {
            $('#main-content').empty().append(view.render().$el);
            twaddlr.currentView = view;
        }
    }

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
            showView(new twaddlr.views.LoginView());
        },

        register: function() {
            console.log('router -> register');
            showView(new twaddlr.views.RegisterView());
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
