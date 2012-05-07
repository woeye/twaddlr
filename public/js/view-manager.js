(function(twaddlr) {
    
    var currentView = false;
    var templateCache = {};
    var notificationTemplateSource = $('#notification-template').html();
    var notificationTemplate = Handlebars.compile(notificationTemplateSource);

    // Extend Backbone.View
    Backbone.View.prototype.hide = function(callback) {};
    Backbone.View.prototype.show = function(callback) {};

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

    function showsNotification() {
        var n = $('#notifications');
        //console.log("n.length", n.length);
        return n.children().length > 0;        
    }

    twaddlr.ViewManager = {
        showView: function(viewObj) {
            // Remove all remaining notifications
            this.clearNotification(false, function() {
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
            });
        },

        showNotification: function(type, msg, callback) {
            var n = $('#notifications');
            this.clearNotification(true, function() {
                n.empty()
                    .html(notificationTemplate({
                        type: type,
                        msg: msg
                    }));
                n.css3Animate('bounceIn', function() {
                    if (callback) callback();           
                });
            });
        },

        clearNotification: function(animated, callback) {
            var n = $('#notifications');    
            function doClear() {
                n.empty();
                if (callback) callback();
            }
            if (animated && showsNotification()) {
                n.css3Animate('fadeOut', function() {
                    doClear();
                });
            } else {
                doClear();
            }
        }
    };
    console.log(twaddlr.ViewManager);

})(twaddlr);