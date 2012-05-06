(function(twaddlr) {

    twaddlr.views.RegisterView = Backbone.View.extend({
        templateName: 'register',
        className: 'register-view',

        initialize: function() {
            console.log('RegisterView -> initialize');
        },

        events: {
            'click a': 'showLoginForm',
            'submit form': 'doRegister'
        },

        show: function() {
            var self = this;
            twaddlr.socket.on('registration:usernameAvailableResult', function(result) {
                console.log('Username [' + result.username + '] is available: ' + result.available);
                if (result.available) {
                    //self.$el.find('div[data-role="error-login-in-use"]').css('display', 'none');
                    self.$el.find('div[data-role="ctrl-group-username"]').removeClass('error');
                    self.$el.find('button').removeAttr('disabled');
                } else {
                    //self.$el.find('div[data-role="error-login-in-use"]').css('display', 'block');
                    self.$el.find('div[data-role="ctrl-group-username"]').addClass('error');
                    self.$el.find('button').attr('disabled', 'disabled');
                }
                //self.render();
            });
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
            var self = this;

            e.preventDefault();
            var data = {
                username: this.$el.find('#username').val(),
                password: this.$el.find('#password').val(),
                email: this.$el.find('#email').val()
            };
            twaddlr.socket.once('registration:registered', function() {
                twaddlr.ViewManager.showNotification('success', "Registered successfully!");
            });
            twaddlr.socket.once('registration:error', function() {
                twaddlr.ViewManager.showNotification('error', "Registration failed!");
            });

            twaddlr.socket.emit('registration:register', data);
        }
    });

})(twaddlr);
