(function(twaddlr) {

  twaddlr.models.AppState = Backbone.Model.extend({
    username: false,
    token: false,

    isAuthorized: function() {
      return (this.get('token') !== false);
    },

    flushAuth: function() {
      this.set({
        username: false,
        token: false
      });
    }
  });

  twaddlr.appState = new twaddlr.models.AppState();

})(twaddlr);