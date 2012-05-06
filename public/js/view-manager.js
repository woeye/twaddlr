(function(twaddlr) {
    
    var currentView = false;
    var templateCache = {};
    var notificationTemplateSource = $('#notification-template').html();
    var notificationTemplate = Handlebars.compile(notificationTemplateSource);

    // Extend Backbone.View
    Backbone.View.prototype.hide = function(callback) {}
    Backbone.View.prototype.show = function(callback) {}

    function loadTemplate(view, callback) {
        var self = this;
        getTemplate(view.templateName, function(err, template) {
            view.template = template;
            callback(err);
        });
    }

    function getTemplate(name, callback) {
        // Do we have loaded the template before?
        console.log(templateCache);
        if (templateCache.hasOwnProperty(name)) {
            console.log('Template found in cache!');
            callback(null, templateCache[name]);
        } else {
            console.log('Template not found: ' + name);
            console.log('Loading template ...');
            $.get('templates/' + name + '.html', function(data) {
                console.log('Template loaded!');
                templateCache[name] = Handlebars.compile(data);
                callback(null, templateCache[name]);
            });
        }
    }

    twaddlr.ViewManager = {
        showView: function(viewObj) {
            // Remove all remaining notifications
            $('#notifications').empty();

            // Initialize the view
            var view = new viewObj();
            loadTemplate(view, function(err) {
                if (currentView) {
                    $('#main-content').css3Animate('fadeOut', function() {
                        currentView.hide();
                        $('#main-content').empty().append(view.render().$el);
                        currentView = view;
                        $('#main-content').css3Animate('fadeIn', function() {
                            currentView.show();
                        });
                    });
                } else {
                    $('#main-content').empty().append(view.render().$el);
                    currentView = view;
                    currentView.show();
                }
            });
        },

        showNotification: function(type, msg) {
            $('#notifications').empty()
                .html(notificationTemplate({
                    type: type,
                    msg: msg
                }));
        }

    };
    console.log(twaddlr.ViewManager);

})(twaddlr);