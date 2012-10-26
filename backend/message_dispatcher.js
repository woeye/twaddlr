var net = require('net'),
    engine = require('engine.io'),
    //sockjs = require('sockjs'),
    events = require('events');

module.exports = MessageDispatcher;

function createEnvelope(type, message) {
  var envelope = {
    type: type,
    msg: message
  };
  return JSON.stringify(envelope);
}

function parseEnvelope(envelope) {
  return JSON.parse(envelope);
}

///////////////////////////////////////////////////////////////////////////////
// EngineConnection 

function EngineConnection(socket) {
  this.socket = socket;
  this.subscribers = {};
}

EngineConnection.prototype.on = function(type, callback) {
  this.subscribers[type] = callback;
};

EngineConnection.prototype.send = function(type, message) {
  var envelope = createEnvelope(type, message);
  console.log("Sending message to engine.io socket [" + this.socket.id + "]: " + envelope);
  this.socket.send(envelope);
};

EngineConnection.prototype._handleMsg = function(type, message) {
  console.log(type);
  if (this.subscribers.hasOwnProperty(type)) {
    this.subscribers[type](message);
  }
};

///////////////////////////////////////////////////////////////////////////////
// NetConnection 

function NetConnection(con) {
  this.con = con;
  this.subscribers = {};
}

NetConnection.prototype.on = function(type, callback) {
  this.subscribers[type] = callback;
};

NetConnection.prototype.send = function(type, message) {
  var envelope = createEnvelope(type, message);
  console.log("Sending message to net socket [" + this.con.id + "]: " + envelope);
  this.con.write(envelope + '\r\n');
};

NetConnection.prototype._handleMsg = function(type, message) {
  console.log(type);
  if (this.subscribers.hasOwnProperty(type)) {
    this.subscribers[type](message);
  }
};

///////////////////////////////////////////////////////////////////////////////
// MessageDispatcher 

function MessageDispatcher(server) {
  var self = this;

  events.EventEmitter.call(this);

  self.connections = {};
  self.listeners = {};

  self.engineServer = engine.attach(server);
  self.engineServer.on('connection', function(socket) {
    console.log("Got new connection! ID:", socket.id);

    var engineCon = new EngineConnection(socket);
    self.emit('connection', engineCon);
    self.connections[socket.id] = engineCon;

    socket.on('close', function() {
      console.log("Connection closed! ID: " + socket.id);
      delete(self.connections[socket.id]);
      console.log("Remaining connections: ", Object.keys(self.connections).length);
      self.emit('disconnect', engineCon);
    });

    socket.on('message', function(data, flags) {
      console.log("Got data on socket [" + socket.id + "]: ", data);
      
      try {
        var obj = parseEnvelope(data);
        engineCon._handleMsg(obj.type, obj.msg);        
      } catch (e) {
        console.log("Couldn't parse engine.io client data", e);
      }
    });

    socket.on('error', function(error) {
      console.log("Got error", error);
    });

  });

  self.netServer = net.createServer(function(con) {
    console.log("Got TCP connection!");
    con.id = "tcp-" + new Date().getTime();

    var netCon = new NetConnection(con);
    self.emit('connection', netCon);
    self.connections[con.id] = netCon;

    con.on('data', function(rawData) {
      var data = rawData.toString('utf-8');
      console.log("Got data from TCP client: " + data);
      try {
        var obj = parseEnvelope(data);
        netCon._handleMsg(obj.type, obj.msg);
      } catch (e) {
        console.log("Couldn't parse TCP client data", e);
      }
    });

    con.on('end', function() {
      console.log("TCP client disconnected: " + con.id);
      delete(self.connections[con.id]);
    });
  });
  self.netServer.listen(8000, function() {
    console.log("Started TCP server on port 8000");
  });
}

MessageDispatcher.prototype = Object.create(events.EventEmitter.prototype);

MessageDispatcher.prototype.broadcast = function(type, msg) {
  Object.keys(this.connections).forEach(function(conId) {
    var mdCon = this.connections[conId];
    mdCon.send(type, msg);
  }.bind(this));
}
