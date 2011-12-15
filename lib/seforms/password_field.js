var BaseField = require('./base_field');

module.exports = PasswordField;

function PasswordField(name, options) {
  options.attributes = options.attributes || {};
  options.attributes.type = 'password';
  BaseField.call(this, name, 'input', options);
}

PasswordField.prototype.__proto__ = BaseField.prototype;
