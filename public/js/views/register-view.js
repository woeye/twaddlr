(function(twaddlr) {

    console.log(twaddlr);

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
            $('#main-content').empty().append(this.$el);
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
            //alert('not implemented yet :/');
            var data = {
                username: this.$el.find('#username').val(),
                password: this.$el.find('#password').val(),
                email: this.$el.find('#email').val()
            };
            //console.log(data);

            // TODO: Proper error handling ;)
            $.ajax({
                type: 'POST',
                url: '/api/register',
                data: data
            }).done(function(response) {
                console.log(response);
            });
        }
    });

})(twaddlr);
