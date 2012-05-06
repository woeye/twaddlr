(function(twaddlr) {

    twaddlr.views.ChatView = Backbone.View.extend({
        templateName: 'chat',
        className: 'chat-view',

        initialize: function() {
        },

        events: {
        },

        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });

})(twaddlr);
