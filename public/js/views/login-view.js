(function(twaddlr) {

    twaddlr.views.LoginView = Backbone.View.extend({
        className: 'login-view',
        //el: '#login-view',
        //template: $('#login-form-template').html(),

        initialize: function() {
        },

        events: {
            'click a': 'showRegisterForm',
            'submit form': 'doLogin'
        },

        render: function() {
            console.log('render');
            this.$el.html(twaddlr.templates['login-template']);
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

            /*$.ajax({
                type: 'POST',
                url: '/api/login',
                data: data
            }).done(function(res) {
                console.log('Server responded', res);
                twaddlr.token = res; // remeber the token
                twaddlr.trigger('twaddlr:showChatView');
            });*/

            twaddlr.socket.emit('login', data);
            twaddlr.socket.on('login:done', function(data) {
                console.log('login done!');
                twaddlr.trigger('twaddlr:showChatView');
            });          

            // TODO: error handling

        }
    });

})(twaddlr);
