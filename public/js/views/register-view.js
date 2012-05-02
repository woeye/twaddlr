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

        render: function() {
            this.$el.html(twaddlr.templates['register-template']);
            this.$el.find('input').inputPimp();
            return this;
        },

        showLoginForm: function(e) {
            e.preventDefault();
            twaddlr.trigger('twaddlr:showLoginView');
        },

        doRegister: function(e) {
            e.preventDefault();
            // this.$el.animate({
            //     opacity: 0.0
            // }, 100, 'linear', function() {
            //     console.log('anim done');
            // });

            //alert('not implemented yet :/');
            var data = {
                login: this.$el.find('#login').val(),
                password: this.$el.find('#password').val(),
                email: this.$el.find('#email').val()
            };
            console.log(data);

            twaddlr.socket.once('registration:registered', function() {
                console.log('it worked!');
            });
            twaddlr.socket.once('registration:error', function(err) {
                console.log('it failed :(', err);
            });

            twaddlr.socket.emit('registration:register', data);

            //console.log(data);

            // TODO: Proper error handling ;)
            //$.ajax({
            //    type: 'POST',
            //    url: '/api/register',
            //    data: data
            //}).done(function(response) {
            //    console.log(response);
            //});
        }
    });

})(twaddlr);
