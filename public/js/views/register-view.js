(function(twaddlr) {

    twaddlr.views.RegisterView = Backbone.View.extend({
        className: 'register-view',
        //el: '#register-view',
       // template: $('#register-form-template').html(),

        initialize: function() {
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
        },

        hide: function() {
            twaddlr.socket.removeAllListeners('registration:registered');
            twaddlr.socket.removeAllListeners('registration:error');
        },

        render: function() {
            this.$el.html(twaddlr.templates['register-template']);
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
        }
    });

})(twaddlr);
