define([
  'backbone', 
  'app/message-dispatcher-client',
  'app/view-manager',
  'app/app-state'
], function(Backbone, MessageDispatcher, ViewManager, AppState) {

  var RegisterView = Backbone.View.extend({
    templateName: 'register',
    className: 'register-view',

    initialize: function() {
    },

    events: {
      'click a': 'showLoginForm',
      'submit form': 'doRegister'
    },

    show: function() {      
      MessageDispatcher.on('registration:usernameAvailableResult', $.proxy(function(result) {
        console.log("Username [" + result.username + "] is available: " + result.available);
        if (result.available) {
          this.$el.find('div[data-role="ctrl-group-username"]').removeClass('error');
          this.$el.find('button').removeAttr('disabled');
          ViewManager.clearNotification(true);
        } else {
          this.$el.find('button').attr('disabled', 'disabled');
          this.$el.find('div[data-role="ctrl-group-username"]').addClass('error');
          ViewManager.showNotification('error', "Username already in use");
        }
      }, this));
    },

    hide: function() {
      //twaddlr.socket.removeAllListeners('registration:usernameAvailableResult');
    },

    render: function() {
      this.$el.html(this.template);
      this.$el.find('#username').blur(function(e) {
        console.log('Checking username available: ' + $(this).val());
        MessageDispatcher.send('registration:usernameAvailable', {
          username: $(this).val()
        });
      });
      return this;
    },

    showLoginForm: function(e) {
      e.preventDefault();
      ViewManager.trigger('twaddlr:showLoginView');
    },

    doRegister: function(e) {
      e.preventDefault();
      var data = {
        username: this.$el.find('#username').val(),
        password: this.$el.find('#password').val(),
        email: this.$el.find('#email').val()
      };

      MessageDispatcher.once('registration:registered', $.proxy(function(data) {
        ViewManager.showNotification('success', "Registered successfully!", $.proxy(function() {
          this.$el.css3Animate('fadeOut', $.proxy(function() {
            this.$el.empty();
            AppState.set({
              username: data.username,
              token: data.token
            });
            ViewManager.trigger('twaddlr:showChatView');
          }, this));
        }, this));
      }, this));

      MessageDispatcher.once('registration:error', function() {
        ViewManager.showNotification('error', "Registration failed!");
      });

      MessageDispatcher.send('registration:register', data);
    }
  });

  //return new RegisterView();
  return RegisterView;
});
