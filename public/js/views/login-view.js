(function(twaddlr) {

    twaddlr.views.LoginView = Backbone.View.extend({
        templateName: 'login',
        className: 'login-view',

        initialize: function() {
        },

        events: {
            'click a': 'showRegisterForm',
            'submit form': 'doLogin'
        },

        render: function() {
            this.$el.html(this.template);
            this.$el.find('input').inputPimp();
            return this;
        },

        showRegisterForm: function(e) {
            e.preventDefault(); // We must call this or the browser URL will be incorrect
            twaddlr.trigger('twaddlr:showRegisterView');
        },

        doLogin: function(e) {
            e.preventDefault();

            var data = {
                   login: this.$el.find('#login').val(),
                password: this.$el.find('#password').val()
            };
            console.log(data);

            twaddlr.socket.emit('login', data);
            twaddlr.socket.on('login:done', function(data) {
                console.log('login done!');
                twaddlr.trigger('twaddlr:showChatView');
            });          

            // TODO: error handling

        }
    });

})(twaddlr);
