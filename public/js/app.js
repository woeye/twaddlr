YUI().use('base', 'app', 'handlebars', 'fancy-label', function(Y) {

    ///////////////////////////////////////////////////////////////////////////////
    // Define views

    var RegisterView = Y.RegisterView = Y.Base.create('registerView', Y.View, [], {
        // Fetch handlebars template from page
        template: Y.Handlebars.compile(Y.one('#register-template').getContent()),

        events: {
            'a': {
                click: 'showLoginView'
            }
        },

        initializer: function() {},

        render: function() {
            this.get('container').setContent(this.template());
            this.get('container').all('input').plug(Y.FancyLabelPlugin);
        },

        showLoginView: function(e) {
            e.preventDefault();
            this.fire('showLoginView');
        }
    }, {
        ATTRS: {
            container: {
                valueFn: function() {
                    return Y.Node.create('<div class="register-view"/>');
                }
            }
        }
    });

    var LoginView = Y.LoginView = Y.Base.create('loginView', Y.View, [], {
        // Fetch handlebars template from page
        template: Y.Handlebars.compile(Y.one('#login-template').getContent()),

        events: {
            'a': {
                click: 'showRegisterView'
            }
        },

        initializer: function() {},

        render: function() {
            this.get('container').setContent(this.template());
            this.get('container').all('input').plug(Y.FancyLabelPlugin);
        },

        showRegisterView: function(e) {
            e.preventDefault();
            this.fire('showRegisterView');
        }        
    }, {
        ATTRS: {
            container: {
                valueFn: function() {
                    return Y.Node.create('<div class="login-view"/>');
                }
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////////
    // Set up the app

    var TwaddlrApp = Y.TwaddlrApp = Y.Base.create('twaddlrApp', Y.App, [], {
        // Our views
        views: {
            register: {type: 'RegisterView'},
            login: {type: 'LoginView'}
        },

        initializer: function() {
            console.log('Starting twaddlr ... :)');

            // Set up app events
            var _this = this;
            this.on('*:showLoginView', function(e) {
                console.log(e);
                _this.navigate('/login');
            });
            this.on('*:showRegisterView', function(e) {
                _this.navigate('/');
            });

            this.once('ready', function(e) {
                // Remove the loading info
                Y.one('#main-content').empty();
                this.navigate('/login');
            });
        },

        showRegisterView: function() {
            this.showView('register');
        },

        showLoginView: function() {
            console.log('inside showLoginView');
            this.showView('login');
        }

    }, {
        ATTRS: {
            // Disable server routing
            serverRouting: {
                value: false
            },

            viewContainer: {
                value: '#main-content'
            },

            // Our routes
            routes: {
                value: [
                    {path: '/', callback: 'showRegisterView'},
                    {path: '/login', callback: 'showLoginView'},
                ]
            }
        }
    });


    var app = new TwaddlrApp();
});