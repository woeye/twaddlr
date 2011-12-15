var BaseField = require('./base_field');

module.exports = TextField;

function TextField(name, options) {
  options.extras = options.extras || {};
  options.extras.type = 'text';
  BaseField.call(this, name, 'input', options);
}

TextField.prototype.__proto__ = BaseField.prototype;
