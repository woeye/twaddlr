(function(twaddlr) {

    twaddlr.views.LoginView = Backbone.View.extend({
        templateName: 'login',
        className: 'login-view',

        initialize: function() {
            if (twaddlr.token) {
                twaddlr.trigger('twaddlr:showChatView');
            }
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
            var self = this;
            e.preventDefault();

            var data = {
                username: this.$el.find('#username').val(),
                password: this.$el.find('#password').val()
            };

            twaddlr.socket.once('login:done', function(data) {
                console.log("Login sucess! My token: ", data.token);
                twaddlr.token = data.token;
                twaddlr.ViewManager.showNotification('success', "Logged in successfully!", function() {
                    self.$el.css3Animate('fadeOut', function() {
                        self.$el.empty();
                        twaddlr.trigger('twaddlr:showChatView');
                    });
                });
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
