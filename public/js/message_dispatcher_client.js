(function(twaddlr) {
  function MessageDispatcher() {
    console.log('Connecting to server ...');
    //this.sockjs = new SockJS('/sockjs');
    this.ws = new WebSocket('ws://localhost:3000');

    this.subscribers = {};

    this.ws.onopen = function() {
      console.log('Connection opened!');
    };

    this.ws.onmessage = $.proxy(function(e) {
      console.log('Got message: ', e.data);
      var data = JSON.parse(e.data);

      var type = data['type'];
      console.log(type);
      console.log(this.subscribers);
      if (_.has(this.subscribers, type)) {
        var cb = this.subscribers[type].callback;
        cb(data.msg);
        if (cb.onlyOnce) delete(this.subscribers[type]);
      }
    }, this);

    this.ws.onclose = function() {
      console.log('Connection closed!');
    };

  }

  MessageDispatcher.prototype.on = function(type, callback) {
    this.subscribers[type] = {
      callback: callback,
      onlyOnce: false
    };
  };

  MessageDispatcher.prototype.once = function(type, callback) {
    this.subscribers[type] = {
      callback: callback,
      onlyOnce: true
    };
  };

  MessageDispatcher.prototype.send = function(type, msg) {
    var envelope = {
      type: type,
      msg: msg
    };
    var data = JSON.stringify(envelope);
    this.ws.send(data);
  };

  twaddlr.MessageDispatcher = MessageDispatcher;

})(twaddlr);