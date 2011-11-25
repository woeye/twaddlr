var util = require('util');

function Base() {
	this.name = 'base';
}

Base.prototype.sayHello = function() {
	console.log('hello from ' + this.name);
}

function Moo() {
	Moo.super_.call(this);
	this.name = 'moo';
}

util.inherits(Moo, Base);

Moo.prototype.sayHello = function() {
	console.log('Calling from: ' + this.name);
	Moo.super_.prototype.sayHello.call(this);
}

//Moo.prototype.sayHello = function() {
//	console.log('Calling from moo!');
//}

var b = new Base();
b.sayHello();

var m = new Moo();
m.sayHello();