(function(twaddlr) {

  // Set up the main app view
  var appView = twaddlr.appView = new twaddlr.views.AppView();

  // Define the main router
  var AppRouter = Backbone.Router.extend({
    routes: {
      "login": "login",
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
    twaddlr.router.navigate('/login', {trigger:true});
  });

  twaddlr.on('twaddlr:showRegisterView', function() {
    twaddlr.router.navigate('/register', {trigger:true});
  });

  twaddlr.on('twaddlr:showChatView', function() {
    twaddlr.router.navigate('/chat', {trigger:true});
  });

  function reauthenticate(username, token, callback) {
      console.log("Reauthenticating with server ...");
      twaddlr.dispatcher.send('login:reauthenticate', {
        username: username,
        token: token 
      });
      twaddlr.dispatcher.once('login:reauthenticationSucceeded', function() {
        console.log("Reauthentication worked!");
        if (callback) callback(true);
      });
      // TODO: Deal with result (login:reconnectSucceeded/Failed)    
  }

  twaddlr.start = function() {
    twaddlr.dispatcher = new twaddlr.MessageDispatcher();

    console.log('x');
    twaddlr.dispatcher.on('connection:welcome', function(msg) {
      console.log("Got welcome message from server", msg);

      if (_.isUndefined(twaddlr.historyStarted)) {
        console.log("Starting Backbone history ...");
        twaddlr.historyStarted = Backbone.history.start();
      } 

      // Check for existing authentication cookies
      var username = $.cookie('twaddlr_username');
      var token = $.cookie('twaddlr_token');
      console.log(username, token);
      if (username && token) {
        console.log("Found username and token in session!");
        reauthenticate(username, token, function(result) {
          twaddlr.appState.set('username', username);
          twaddlr.appState.set('token', token);
          twaddlr.router.navigate('/chat', {trigger:true});
        });
      } else {
        twaddlr.router.navigate('register', {trigger: true, replace: true});        
      }
    });

    /*
    socket.on('reconnect', function() {
      console.log("Client reconnected!");
      reauthenticate(twaddlr.appState.get('username'), twaddlr.appState.get('token'));
    });*/
  };

})(twaddlr);

// One the document is ready start the app
$(document).ready(function() {
  twaddlr.start();
});
