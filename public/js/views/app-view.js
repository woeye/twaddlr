(function(twaddlr) {

    twaddlr.views.AppView = Backbone.View.extend({
        el: 'body',

        events: {
            'click a[data-action="logout"]': 'logout'            
        },

        initialize: function() {
            console.log("Initialize");

            twaddlr.appState.on('change:token', $.proxy(function() {
                console.log("Token changed!");
                this.update();
            }, this));
        },

        update: function() {
            if (twaddlr.appState.isAuthorized()) {
                this.$el.find('li[data-role="logout"]').css('display', 'block');
            } else {
                this.$el.find('li[data-role="logout"]').css('display', 'none');
            }
        },

        logout: function() {
            twaddlr.appState.flushAuth();
            this.update();
            twaddlr.trigger('twaddlr:showLoginView');
        }
    });

})(twaddlr);