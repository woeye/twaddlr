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

    // Define the main router
    var AppRouter = Backbone.Router.extend({
        routes: {
            "login": "login",
            "register": "register",
            "chat": "chat"
        },

        login: function() {
            console.log('router -> login');
            showView(new twaddlr.views.LoginView());
        },

        register: function() {
            console.log('router -> register');
            showView(new twaddlr.views.RegisterView());
        },

        chat: function() {
            console.log('router -> chat');
            showView(new twaddlr.views.ChatView());
        }
    });
    twaddlr.router = new AppRouter();

    // Inject Backbone Events into twaddlr
    _.extend(twaddlr, Backbone.Events);

    twaddlr.on('twaddlr:showLoginView', function() {
        twaddlr.router.navigate('/login', {trigger:true});
    });

    twaddlr.on('twaddlr:showRegisterView', function() {
        twaddlr.router.navigate('/register', {trigger:true});
    });

    twaddlr.on('twaddlr:showChatView', function() {
        twaddlr.router.navigate('/chat', {trigger:true});
    });


    twaddlr.start = function() {
        // Precompile the handlebar templates
        $('script[type="text/x-handlebars-template"]').each(function() {
            twaddlr.templates[$(this).attr('id')] = Handlebars.compile($(this).html());
        });
        console.log('Compiled all templates ...');

        // Establish a socket.io connection ...
        console.log('Connecting to server ...');
        var socket = twaddlr.socket = io.connect('http://localhost');
        socket.on('connected', function(data) {
            console.log('connected!');
            Backbone.history.start();
            twaddlr.router.navigate('register', {trigger: true, replace: true});
        });
    };

})(twaddlr);

// One the document is ready start the app
$(document).ready(function() {
    twaddlr.start();
});
