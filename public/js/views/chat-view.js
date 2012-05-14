(function(twaddlr) {

    twaddlr.views.ChatView = Backbone.View.extend({
        templateName: 'chat',
        className: 'chat-view',

        initialize: function() {
            if (twaddlr.appState.isAuthorized() === false) {
                console.log("Not authorized! Requesting loginView ...");
                twaddlr.trigger('twaddlr:showLoginView');
            }
        },

        events: {
        },

        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });

})(twaddlr);
