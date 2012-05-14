(function(twaddlr) {

    twaddlr.views.LoginView = Backbone.View.extend({
        templateName: 'login',
        className: 'login-view',

        initialize: function() {
            if (twaddlr.token) {
                twaddlr.trigger('twaddlr:showChatView');
            }

            /*var usernameCookie = $.cookie('twaddlr_username');
            var tokenCookie = $.cookie('twaddlr_token');
            if (usernameCookie && tokenCookie) {
                twaddlr.token.once('login:verifyTokenSucceeded', function() {
                    twaddlr.token = tokenCookie;
                    twaddlr.trigger('twaddlr:showChatView');
                });
                twaddlr.token.emit('login:verifyToken', {
                    username: usernameCookie,
                    token: tokenCookie
                });
            }*/
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

            var username = this.$el.find('#username').val();
            var password = this.$el.find('#password').val();  

            twaddlr.socket.once('login:done', $.proxy(function(data) {
                console.log("Login sucess! My token: ", data.token);
                // $.cookie('twaddlr_username', username);
                // $.cookie('twaddlr_token', twaddlr.token);
                twaddlr.viewManager.showNotification('success', "Logged in successfully!", $.proxy(function() {
                    this.$el.css3Animate('fadeOut', $.proxy(function() {
                        this.$el.empty();
                        twaddlr.appState.set({
                            username: username,
                            token: data.token
                        });
                        twaddlr.trigger('twaddlr:showChatView');
                    }, this));
                }, this));
            }, this));          

            twaddlr.socket.once('login:error', function(data) {
                console.log("Login failed!", data);
                if (data.error == 'invalidUsername') {
                    twaddlr.viewManager.showNotification('error', "Invalid username!");
                } else if (data.error == 'invalidPassword') {
                    twaddlr.viewManager.showNotification('error', "Invalid password!");
                } else {
                    twaddlr.viewManager.showNotification('error', "Login failed!");
                }
            });

            twaddlr.socket.emit('login:login', {
                username: username,
                password: password
            });
        }
    });

})(twaddlr);
