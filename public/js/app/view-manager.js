define([
  'backbone', 
  'handlebars', 
  'app/app-state',
  'jquery.animate'
], function(Backbone, Handlebars, AppState) {

  var currentView = false;
  var templateCache = {};
  var notificationTemplateSource = $('#notification-template').html();
  var notificationTemplate = Handlebars.compile(notificationTemplateSource);

  // Extend Backbone.View
  Backbone.View.prototype.hide = function(callback) {};
  Backbone.View.prototype.show = function(callback) {};
  Backbone.View.prototype.requiresAuth = false;
    // body...

  function loadTemplate(view, callback) {
    var self = this;
    if ('templateName' in view) {
      getTemplate(view.templateName, function(err, template) {
        view.template = template;
        callback(err);
      });
    } else {
      callback(null);
    }
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

  function loadView(view) {
    loadTemplate(view, function(err) {
      if (currentView) {
        $('#main-content').css3Animate('fadeOut', function() {
          currentView.hide();
          $('#main-content').empty().append(view.render().$el);
          currentView = view;
          AppState.set({ currentView: currentView });
          $('#main-content').css3Animate('fadeIn', function() {
            currentView.show();
            //$('body').removeClass();
            //$('body').addClass('view-' + currentView.className);
          });
        });
      } else {
        console.log(view.render().$el);
        $('#main-content').empty().append(view.render().$el);
        currentView = view;
        AppState.set({ currentView: currentView });
        currentView.show();
        //$('body').removeClass();
        //$('body').addClass('view-' + currentView.className);
      }
    });
  }

  var ViewManager = {
    showView: function(viewObj) {
      // Remove all remaining notifications
      var self = this;
      this.clearNotification(false, function() {
        // Initialize the view
        var view = new viewObj();
        if (view.requiresAuth && AppState.isAuthorized() === false) {
          console.log("View requires authentication! Redirecting to login view ...");
          self.trigger('twaddlr:showLoginView');
        } else {
          loadView(view);
        }
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

  _.extend(ViewManager, Backbone.Events);
  return ViewManager;

});
