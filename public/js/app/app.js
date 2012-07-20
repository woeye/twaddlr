define([
  'jquery',
  'underscore',
  'backbone',
  'app/view-manager',
  'app/message-dispatcher-client',
  'app/app-state',
  'views/views',
  'jquery.cookie'
], function($, _, Backbone, ViewManager, MessageDispatcher, AppState, Views) {

  // Init the main appView
  var appView = new Views.AppView();

  // Define the main router
  var router = new (Backbone.Router.extend({
    routes: {
      "login": "login",
      "register": "register",
      "chat": "chat"
    },

    login: function() {
      console.log('router -> login');
      ViewManager.showView(Views.LoginView);
    },

    register: function() {
      console.log('router -> register');
      ViewManager.showView(Views.RegisterView);
    },

    chat: function() {
      console.log('router -> chat');
      appView.update();
      ViewManager.showView(Views.ChatView);
    }
  }));


  ViewManager.on('twaddlr:showLoginView', function() {
    router.navigate('/login', {trigger:true});
  });

  ViewManager.on('twaddlr:showRegisterView', function() {
    router.navigate('/register', {trigger:true});
  });

  ViewManager.on('twaddlr:showChatView', function() {
    router.navigate('/chat', {trigger:true});
  });

  function reauthenticate(username, token, callback) {
      console.log("Reauthenticating with server ...");
      MessageDispatcher.send('login:reauthenticate', {
        username: username,
        token: token 
      });
      MessageDispatcher.once('login:reauthenticationSucceeded', function() {
        console.log("Reauthentication worked!");
        if (callback) callback(true);
      });
      // TODO: Deal with result (login:reconnectSucceeded/Failed)    
  }

  return {
    start: function() {
      //twaddlr.dispatcher = new MessageDispatcher();
      //twaddlr.dispatcher.connect();
      MessageDispatcher.connect();

      console.log('x');
      MessageDispatcher.on('connection:welcome', function(msg) {
        console.log("Got welcome message from server", msg);

        if (_.isUndefined(AppState.historyStarted)) {
          console.log("Starting Backbone history ...");
          AppState.historyStarted = Backbone.history.start();
        } 

        router.navigate('register', {trigger: true, replace: true});        

        // Check for existing authentication cookies
        /*var username = $.cookie('twaddlr_username');
        var token = $.cookie('twaddlr_token');
        console.log(username, token);
        if (username && token) {
          console.log("Found username and token in session!");
          reauthenticate(username, token, function(result) {
            AppState.set('username', username);
            AppState.set('token', token);
            router.navigate('/chat', {trigger:true});
          });
        } else {
          router.navigate('register', {trigger: true, replace: true});        
        }*/
      });
    }
  }

    /*
  twaddlr.start = function() {

    socket.on('reconnect', function() {
      console.log("Client reconnected!");
      reauthenticate(twaddlr.appState.get('username'), twaddlr.appState.get('token'));
    });
  };*/
});

// One the document is ready start the app
//$(document).ready(function() {
//  twaddlr.start();
//});
