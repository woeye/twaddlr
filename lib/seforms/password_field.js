var BaseField = require('./base_field');

module.exports = PasswordField;

function PasswordField(name, options) {
  options.extras = options.extras || {};
  options.extras.type = 'password';
  BaseField.call(this, name, 'input', options);
}

PasswordField.prototype.__proto__ = BaseField.prototype;
