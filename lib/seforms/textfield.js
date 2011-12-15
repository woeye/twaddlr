var BaseField = require('./base_field');

module.exports = TextField;

function TextField(name, options) {
  options.attributes = options.attributes || {};
  options.attributes.type = 'text';
  BaseField.call(this, name, 'input', options);
}

TextField.prototype = Object.create(BaseField.prototype);
