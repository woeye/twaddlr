define(['engine.io'], function(eio) {

  function MessageDispatcher() {
    console.log('Connecting to server ...');

    //this.sockjs = new SockJS('/sockjs');
    console.log(document.location.href);
    this.subscribers = {};
  }

  MessageDispatcher.prototype.connect = function() {
    this.socket = new eio.Socket({
      host: 'localhost',
      port: 3000
    });


    //this.socket.onopen = function() {
    this.socket.on('open', function() {
      console.log('Connection opened!');
    });

    //this.socket.onerror = function() {
    this.socket.on('error', function(err) {
      console.log("Couldn't connect :(");
    });

    //this.socket.onmessage = $.proxy(function(e) {
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

    //this.socket.onclose = function() {
    this.socket.on('close', function() {
      console.log('Ups! Connection closed! Trying to reconnect ...');
      setTimeout($.proxy(this.connect, this), 2000);
    });
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
    this.socket.send(data);
  };

  return new MessageDispatcher();

});