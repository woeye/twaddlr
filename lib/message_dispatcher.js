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
    /*con.write(JSON.stringify({
      type: 'connection:connected',
      msg: 'welcome to twaddlr'
    }));*/

    var mdCon = new MDConnection(con);
    this.emit('connection', mdCon);
    this.connections[con.id] = mdCon;


    con.on('close', function() {
      console.log("Connection closed! ID: " + con.id);
      delete(this.connections[con.id]);
      console.log("Remaining connections: ", Object.keys(this.connections).length);
    }.bind(this));

    con.on('data', function(data) {
      console.log("Got data on connection: ", con.id);
      console.log(data);
      
      var obj = parseEnvelope(data);
      mdCon._handleMsg(obj.type, obj.msg);
    }.bind(this));

  }.bind(this));
}

/*MessageDispatcher.prototype.on = function(type, callback) {
  this.listeners[type] = callback;
};

MessageDispatcher.prototype.emit = function(type, message) {
};

MessageDispatcher.prototype.broadcast = function(type, message) {
  var envelope = {
    type: type,
    msg: message
  };
  var data = JSON.stringify(envelope);

  this.connections.forEach(function(con) {
    con.write(data);
  });
};*/

MessageDispatcher.prototype = Object.create(events.EventEmitter.prototype);

module.exports = MessageDispatcher;