// Our global app object
var twaddlr = {};

(function(twaddlr) {

    // Init
    twaddlr.views = {};
    twaddlr.templates = {};
    twaddlr.currentView = false;

    /*Backbone.View.prototype.hide = function(callback) {
        console.log(this);
        this.$el.css3Animate('fadeOut', callback);
    };

    Backbone.View.prototype.show = function(callback) {
        this.$el.css3Animate('fadeIn', callback);
    }*/

    function showView(view) {
        /*if (twaddlr.currentView) {
            twaddlr.currentView.hide(function() {
                $('#main-content').empty().append(view.render().$el);
                twaddlr.currentView = view;
                twaddlr.currentView.show();                
            });
        } else {
            $('#main-content').empty().append(view.render().$el);
            twaddlr.currentView = view;
        }*/

        if (twaddlr.currentView) {
           $('#main-content').css3Animate('fadeOut', function() {
               $('#main-content').empty().append(view.render().$el);
               twaddlr.currentView = view;
               $('#main-content').css3Animate('fadeIn');
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
        console.log('Compiled all templates ...');

        Backbone.history.start();
        twaddlr.router.navigate('register', {trigger: true, replace: true});
    };

})(twaddlr);

// One the document is ready start the app
$(document).ready(function() {
    twaddlr.start();
});
