(function(twaddlr) {

    twaddlr.views.ChatView = Backbone.View.extend({
        className: 'chat-view',
        //el: '#register-view',
       // template: $('#register-form-template').html(),

        initialize: function() {
        },

        events: {
        },

        render: function() {
            this.$el.html(twaddlr.templates['chat-template']);
            return this;
        }
    });

})(twaddlr);
