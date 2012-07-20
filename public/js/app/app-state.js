define(['backbone'], function(Backbone) {
  
  var AppState = Backbone.Model.extend({
    username: false,
    token: false,

    isAuthorized: function() {
      console.log("hasToken: " + this.has('token'));
      return (this.has('token'));
    },

    flushAuth: function() {
      this.unset('username');
      this.unset('token');
      $.cookie('twaddlr_username', null);
      $.cookie('twaddlr_token', null);
    }
  });

  return new AppState();

});
