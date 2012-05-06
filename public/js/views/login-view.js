(function(twaddlr) {

    twaddlr.views.LoginView = Backbone.View.extend({
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
            twaddlr.trigger('twaddlr:showRegisterView');
        },

        doLogin: function(e) {
            e.preventDefault();

            var data = {
                username: this.$el.find('#username').val(),
                password: this.$el.find('#password').val()
            };

            // Reset notifications
            $('.alert').css('display', 'none');

            twaddlr.socket.once('login:done', function(data) {
                console.log("Login sucess! My token: ", data.token);
                twaddlr.token = data.token;
                twaddlr.trigger('twaddlr:showChatView');
                twaddlr.ViewManager.showNotification('success', "Logged in successfully!");
            });          
            twaddlr.socket.once('login:error', function(data) {
                console.log("Login failed!", data);
                if (data.error == 'invalidUsername') {
                    twaddlr.ViewManager.showNotification('error', "Invalid username!");
                } else if (data.error == 'invalidPassword') {
                    twaddlr.ViewManager.showNotification('error', "Invalid password!");
                } else {
                    twaddlr.ViewManager.showNotification('error', "Login failed!");
                }
            });
            twaddlr.socket.emit('login:login', data);
        }
    });

})(twaddlr);
