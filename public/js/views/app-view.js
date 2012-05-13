(function(twaddlr) {

    twaddlr.views.AppView = Backbone.View.extend({
        el: 'body',

        events: {
            'click a[data-action="logout"]': 'logout'            
        },

        initialize: function() {
            console.log("Initialize");
        },

        update: function() {
            if (twaddlr.token) {
                this.$el.find('li[data-role="logout"]').css('display', 'block');
            } else {
                this.$el.find('li[data-role="logout"]').css('display', 'none');
            }
        },

        logout: function() {
            twaddlr.flushLoginState();
            this.update();
            twaddlr.trigger('twaddlr:showLoginView');
        }
    });

})(twaddlr);