(function(twaddlr) {

    // Set up the main app view
    var appView = twaddlr.appView = new twaddlr.views.AppView();

    // Define the main router
    var AppRouter = Backbone.Router.extend({
        routes: {
            "": "login",
            "register": "register",
            "chat": "chat"
        },

        login: function() {
            console.log('router -> login');
            twaddlr.viewManager.showView(twaddlr.views.LoginView);
        },

        register: function() {
            console.log('router -> register');
            twaddlr.viewManager.showView(twaddlr.views.RegisterView);
        },

        chat: function() {
            console.log('router -> chat');
            appView.update();
            twaddlr.viewManager.showView(twaddlr.views.ChatView);
        }
    });
    twaddlr.router = new AppRouter();

    // Inject Backbone Events into twaddlr
    _.extend(twaddlr, Backbone.Events);

    twaddlr.on('twaddlr:showLoginView', function() {
        twaddlr.router.navigate('/', {trigger:true});
    });

    twaddlr.on('twaddlr:showRegisterView', function() {
        twaddlr.router.navigate('/register', {trigger:true});
    });

    twaddlr.on('twaddlr:showChatView', function() {
        twaddlr.router.navigate('/chat', {trigger:true});
    });

    twaddlr.start = function() {
        // Establish a socket.io connection ...
        console.log('Connecting to server ...');
        var socket = twaddlr.socket = io.connect('http://localhost');
        socket.on('connected', function(data) {
            console.log('connected!');
            Backbone.history.start();

            //twaddlr.router.navigate('register', {trigger: true, replace: true});
        });
    };

})(twaddlr);

// One the document is ready start the app
$(document).ready(function() {
    twaddlr.start();
});
