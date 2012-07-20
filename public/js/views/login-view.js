define([
  'backbone', 
  'app/message-dispatcher-client',
  'app/view-manager',
  'app/app-state'
], function(Backbone, MessageDispatcher, ViewManager, AppState) {

  var LoginView = Backbone.View.extend({
    templateName: 'login',
    className: 'login-view',

    initialize: function() {
    },

    events: {
      'click a[data-action="register"]': 'showRegisterForm',
      'submit form': 'doLogin'
    },

    render: function() {
      this.$el.html(this.template);
      return this;
    },

    showRegisterForm: function(e) {
      e.preventDefault(); // We must call this or the browser URL will be incorrect
      ViewManager.trigger('twaddlr:showRegisterView');
    },

    doLogin: function(e) {
      e.preventDefault();

      var username = this.$el.find('#username').val();
      var password = this.$el.find('#password').val();  

      MessageDispatcher.once('login:done', $.proxy(function(data) {
        console.log("Login sucess! My token: ", data.token);
        $.cookie('twaddlr_username', username);
        $.cookie('twaddlr_token', data.token);
        ViewManager.showNotification('success', "Logged in successfully!", $.proxy(function() {
          this.$el.css3Animate('fadeOut', $.proxy(function() {
            this.$el.empty();
            AppState.set({
              username: username,
              token: data.token
            });
            ViewManager.trigger('twaddlr:showChatView');
          }, this));
        }, this));
      }, this));          

      MessageDispatcher.once('login:error', function(data) {
        console.log("Login failed!", data);
        if (data.error == 'invalidUsername') {
          ViewManager.showNotification('error', "Invalid username!");
        } else if (data.error == 'invalidPassword') {
          ViewManager.showNotification('error', "Invalid password!");
        } else {
          ViewManager.showNotification('error', "Login failed!");
        }
      });

      MessageDispatcher.send('login:login', {
        username: username,
        password: password
      });
    }
  });

  //return new LoginView();
  return LoginView;
});
