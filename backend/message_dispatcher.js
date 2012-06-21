var sockjs = require('sockjs'),
    events = require('events');


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
// MDConnection 

function MDConnection(con) {
  this.con = con;
  this.subscribers = {};
}

MDConnection.prototype.on = function(type, callback) {
  this.subscribers[type] = callback;
};

MDConnection.prototype.send = function(type, message) {
  this.con.write(createEnvelope(type, message));
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

  this.sockjsServer = sockjs.createServer();
  this.sockjsServer.installHandlers(server, {prefix: '/sockjs'});
  this.connections = {};
  this.listeners = {};

  this.sockjsServer.on('connection', function (con) {
    console.log("Got new connection! ID: " + con.id);
    
    var mdCon = new MDConnection(con);
    this.emit('connection', mdCon);
    this.connections[con.id] = mdCon;

    con.on('close', function() {
      console.log("Connection closed! ID: " + con.id);
      delete(this.connections[con.id]);
      console.log("Remaining connections: ", Object.keys(this.connections).length);
      this.emit('disconnect', mdCon);
    }.bind(this));

    con.on('data', function(data) {
      console.log("Got data on connection: ", con.id);
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