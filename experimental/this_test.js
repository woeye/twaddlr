function Foo() {
  Object.defineProperty(this, 'name', { value: 'foo' });
  //this.name = 'foo';
}

Foo.prototype.whoAmI = function() {
  console.log(this.name);
}

function Moo() {
  Foo.call(this);
  this.name = 'moo';
}

Moo.prototype.__proto__ = Foo.prototype;

var m = new Moo();
m.whoAmI();