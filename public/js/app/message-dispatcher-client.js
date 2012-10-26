define(['engine.io'], function(eio) {

  function MessageDispatcher() {
    this.subscribers = {};
    this.socket = false;
    this.retries = 0;
  }

  MessageDispatcher.prototype.registerEvents = function() {
    // Register listeners
    this.socket.on('open', function() {
      console.log('Connection opened!');
    });

    this.socket.on('error', function(err) {
      console.log("Couldn't connect :(");
    });

    this.socket.on('message', $.proxy(function(rawData) {
      //console.log('Got message: ', e.data);
      var data = JSON.parse(rawData);
      console.log(data);

      var type = data['type'];
      console.log(type);
      console.log(this.subscribers);
      if (_.has(this.subscribers, type)) {
        var cb = this.subscribers[type];
        cb(data.msg);
        if (cb.onlyOnce) delete(this.subscribers[type]); 
      }
    }, this));

    this.socket.on('close', $.proxy(function() {
      console.log('Ups! Connection closed!');

      // reconnect isn't currently working
      //setTimeout($.proxy(this.connect, this), 10000);
    }, this));
  };

  MessageDispatcher.prototype.connect = function() {
    if (this.socket === false) {
      console.log("Opening new connection to server ...");
      this.socket = new eio.Socket({
        host: 'localhost',
        port: 3000
      });
      this.registerEvents();
    } else {
      console.log("Trying to reconnect!");
      if (this.retries > 5) {
        console.log("Giving up :(");
      } else {
        this.retries++;
        this.socket.open();
      }
    }
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
    console.log("Sending data: ", data);
    this.socket.send(data);
  };

  return new MessageDispatcher();

});