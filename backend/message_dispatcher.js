var ws = require('ws'),
    engine = require('engine.io'),
    //sockjs = require('sockjs'),
    events = require('events');


function createEnvelope(type, message) {
  var envelope = {
    type: type,
    msg: message
  };
  console.log("Created envelope", envelope);
  return JSON.stringify(envelope);
}

function parseEnvelope(envelope) {
  return JSON.parse(envelope);
}

///////////////////////////////////////////////////////////////////////////////
// MDConnection 

function MDConnection(socket) {
  this.socket = socket;
  this.subscribers = {};
}

MDConnection.prototype.on = function(type, callback) {
  this.subscribers[type] = callback;
};

MDConnection.prototype.send = function(type, message) {
  this.socket.send(createEnvelope(type, message));
};

MDConnection.prototype._handleMsg = function(type, message) {
  console.log(type);
  if (this.subscribers.hasOwnProperty(type)) {
    this.subscribers[type](message);
  }
};

///////////////////////////////////////////////////////////////////////////////
// MessageDispatcher 

function MessageDispatcher(server) {
  events.EventEmitter.call(this);

  //this.sockjsServer = sockjs.createServer();
  //this.sockjsServer.installHandlers(server, {prefix: '/sockjs'});
  //this.wsServer = new ws.Server({server: server});

  this.engineServer = engine.attach(server);

  this.connections = {};
  this.listeners = {};

  this.engineServer.on('connection', function(socket) {
    console.log("Got new connection! ID:", socket.id);

    var mdCon = new MDConnection(socket);
    this.emit('connection', mdCon);
    this.connections[socket.id] = socket;

    socket.on('close', function() {
      console.log("Connection closed! ID: " + socket.id);
      delete(this.connections[socket.id]);
      console.log("Remaining connections: ", Object.keys(this.connections).length);
      this.emit('disconnect', mdCon);
    }.bind(this));

    socket.on('message', function(data, flags) {
      console.log("Got data on connection: ", socket.id);
      console.log(data);
      
      var obj = parseEnvelope(data);
      mdCon._handleMsg(obj.type, obj.msg);
    }.bind(this));
  }.bind(this));
}

MessageDispatcher.prototype = Object.create(events.EventEmitter.prototype);

MessageDispatcher.prototype.broadcast = function(type, msg) {
  Object.keys(this.connections).forEach(function(conId) {
    var mdCon = this.connections[conId];
    mdCon.send(type, msg);
  }.bind(this));
}



module.exports = MessageDispatcher;