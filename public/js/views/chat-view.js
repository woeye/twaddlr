(function(twaddlr) {

  twaddlr.views.ChatView = Backbone.View.extend({
    templateName: 'chat',
    className: 'chat-view',
    requiresAuth: true,

    initialize: function() {
    },

    events: {
      'submit form': 'sendChatMessage'
    },

    show: function() {
      console.log("Registering for incoming messages ...");
      twaddlr.socket.on('chat:message', $.proxy(function(data) {
        console.log("Got message from server", data);
        this.$el.find('.msg-view').append('<p><span class="username">[' + data.username + ']</span> ' + data.message + '</p>');
      }, this));
    },

    render: function() {
      this.$el.html(this.template);
      return this;
    },

    sendChatMessage: function(e) {
      e.preventDefault();

      var input = this.$el.find('#chat-message')
      var msg = input.val();
      twaddlr.socket.emit('chat:message', {
        message: msg
      });
      input.val('');
    }

  });

})(twaddlr);
