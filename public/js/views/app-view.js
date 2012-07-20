define([
  'backbone', 
  'app/app-state',
  'app/view-manager'
], function(Backbone, AppState, ViewManager) {

  var AppView = Backbone.View.extend({
    el: 'body',

    events: {
      'click a[data-action="logout"]': 'logout'            
    },

    initialize: function() {
      console.log("Initialize");

      AppState.on('change:token', $.proxy(function() {
        console.log("Token changed!");
        this.update();
      }, this));
    },

    update: function() {
      if (AppState.isAuthorized()) {
        this.$el.find('li[data-role="logout"]').css('display', 'block');
      } else {
        this.$el.find('li[data-role="logout"]').css('display', 'none');
      }
    },

    logout: function() {
      AppState.flushAuth();
      this.update();
      ViewManager.trigger('twaddlr:showLoginView');
    }
  });

  //return new AppView();
  return AppView;
});
