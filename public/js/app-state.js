(function(twaddlr) {

  twaddlr.models.AppState = Backbone.Model.extend({
    username: false,
    token: false,

    isAuthorized: function() {
      console.log("hasToken: " + this.has('token'));
      return (this.has('token'));
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