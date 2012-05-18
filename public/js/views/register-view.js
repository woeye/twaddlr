(function(twaddlr) {

    twaddlr.views.RegisterView = Backbone.View.extend({
        templateName: 'register',
        className: 'register-view',

        initialize: function() {
        },

        events: {
            'click a': 'showLoginForm',
            'submit form': 'doRegister'
        },

        show: function() {
            twaddlr.socket.on('registration:usernameAvailableResult', $.proxy(function(result) {
                console.log("Username [" + result.username + "] is available: " + result.available);
                if (result.available) {
                    this.$el.find('div[data-role="ctrl-group-username"]').removeClass('error');
                    this.$el.find('button').removeAttr('disabled');
                    twaddlr.viewManager.clearNotification(true);
                } else {
                    this.$el.find('button').attr('disabled', 'disabled');
                    this.$el.find('div[data-role="ctrl-group-username"]').addClass('error');
                    twaddlr.viewManager.showNotification('error', "Username already in use");
                }
            }, this));
        },

        hide: function() {
            twaddlr.socket.removeAllListeners('registration:usernameAvailableResult');
        },

        render: function() {
            this.$el.html(this.template);
            this.$el.find('#username').blur(function(e) {
                console.log('Checking username available: ' + $(this).val());
                twaddlr.socket.emit('registration:usernameAvailable', {
                    username: $(this).val()
                });
            });
            return this;
        },

        showLoginForm: function(e) {
            e.preventDefault();
            twaddlr.trigger('twaddlr:showLoginView');
        },

        doRegister: function(e) {
            e.preventDefault();
            var data = {
                username: this.$el.find('#username').val(),
                password: this.$el.find('#password').val(),
                email: this.$el.find('#email').val()
            };
            twaddlr.socket.once('registration:registered', $.proxy(function(data) {
                twaddlr.viewManager.showNotification('success', "Registered successfully!", $.proxy(function() {
                    this.$el.css3Animate('fadeOut', $.proxy(function() {
                        this.$el.empty();
                        twaddlr.appState.set({
                            username: data.username,
                            token: data.token
                        });
                        twaddlr.trigger('twaddlr:showChatView');
                    }, this));
                }, this));
            }, this));
            twaddlr.socket.once('registration:error', function() {
                twaddlr.viewManager.showNotification('error', "Registration failed!");
            });

            twaddlr.socket.emit('registration:register', data);
        }
    });

})(twaddlr);
