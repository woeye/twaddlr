define(function() {

  function MessageDispatcher() {
    console.log('Connecting to server ...');
    //this.sockjs = new SockJS('/sockjs');
    console.log(document.location.href);
    this.subscribers = {};
  }

  MessageDispatcher.prototype.connect = function() {
    this.ws = new WebSocket('ws://' + document.location.host);

    this.ws.onopen = function() {
      console.log('Connection opened!');
    };

    this.ws.onerror = function() {
      console.log("Couldn't connect :(");
    };

    this.ws.onmessage = $.proxy(function(e) {
      console.log('Got message: ', e.data);
      var data = JSON.parse(e.data);

      var type = data['type'];
      console.log(type);
      console.log(this.subscribers);
      if (_.has(this.subscribers, type)) {
        var cb = this.subscribers[type];
        cb(data.msg);
        if (cb.onlyOnce) delete(this.subscribers[type]); 
      }
    }, this);

    this.ws.onclose = function() {
      console.log('Ups! Connection closed! Trying to reconnect ...');
      setTimeout($.proxy(this.connect, this), 2000);
    };
  };

  MessageDispatcher.prototype.on = function(type, callback) {
    callback.onlyOnce = false;
    this.subscribers[type] = callback;
  };

  MessageDispatcher.prototype.once = function(type, callback) {
    callback.onlyOnce = true;
    this.subscribers[type] = callback;
  };

  MessageDispatcher.prototype.send = function(type, msg) {
    var envelope = {
      type: type,
      msg: msg
    };
    var data = JSON.stringify(envelope);
    this.ws.send(data);
  };

  return new MessageDispatcher();

});