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

      // Load history
      twaddlr.socket.emit('chat:history');
      twaddlr.socket.once('chat:historyResult', $.proxy(function(messages) {
        _.each(messages, $.proxy(function(msg) {
          this._postMessage(msg);
        }, this));
      }, this));

      twaddlr.socket.on('chat:message', $.proxy(function(msg) {
        console.log("Got message from server", msg);
        this._postMessage(msg);
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
    },

    _postMessage: function(msg) {
      this.$el.find('.msg-view').append('<p><span class="username">[' + msg.username + ']</span> ' + msg.message + '</p>');      
    }

  });

})(twaddlr);
