(function(twaddlr) {

    twaddlr.views.RegisterView = Backbone.View.extend({
        className: 'register-view',
        //el: '#register-view',
       // template: $('#register-form-template').html(),

        initialize: function() {
            this.loginAvailable = true;
        },

        events: {
            'click a': 'showLoginForm',
            'submit form': 'doRegister'
        },

        show: function() {
            var self = this;
            twaddlr.socket.on('registration:registered', function() {
                self._handleRegistered();
            });
            twaddlr.socket.on('registration:error', function() {
                self._handleRegistrationError();
            });
            twaddlr.socket.on('registration:loginAvailableResult', function(result) {
                console.log('Login [' + result.login + '] is available: ' + result.available);
                if (result.available) {
                    //self.$el.find('div[data-role="error-login-in-use"]').css('display', 'none');
                    self.$el.find('div[data-role="ctrl-group-login"]').removeClass('error');
                    self.$el.find('button').removeAttr('disabled');
                } else {
                    //self.$el.find('div[data-role="error-login-in-use"]').css('display', 'block');
                    self.$el.find('div[data-role="ctrl-group-login"]').addClass('error');
                    self.$el.find('button').attr('disabled', 'disabled');
                }
                //self.render();
            });
        },

        hide: function() {
            twaddlr.socket.removeAllListeners('registration:registered');
            twaddlr.socket.removeAllListeners('registration:error');
        },

        render: function() {
            var self = this;
            var template = twaddlr.templates['register-template']; 
            this.$el.html(template({
                loginInUse: !self.loginAvailable
            }));
            this.$el.find('#login').blur(function(e) {
                console.log('Checking login available: ' + $(this).val());
                twaddlr.socket.emit('registration:loginAvailable', {
                    login: $(this).val()
                });
            });
            //this.$el.find('input').inputPimp();
            return this;
        },

        showLoginForm: function(e) {
            e.preventDefault();
            twaddlr.trigger('twaddlr:showLoginView');
        },

        doRegister: function(e) {
            e.preventDefault();
            var data = {
                login: this.$el.find('#login').val(),
                password: this.$el.find('#password').val(),
                email: this.$el.find('#email').val()
            };
            console.log(data);
            twaddlr.socket.emit('registration:register', data);
        },

        _handleRegistered: function() {
            console.log('registered!', this);
        },

        _handleRegistrationError: function() {
            console.log('registration failed :(', this);
        },

        _handleLoginAvailableCheck: function() {

        },
    });

})(twaddlr);
