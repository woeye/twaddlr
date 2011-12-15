var TextField = require('./textfield.js'),
    PasswordField = require('./password_field.js');

module.exports = Form;

function Form(config) {
  this.rowClass = config.rowClass || false;
  this.rowElement = config.rowElement || 'p';
  this.fields = config.fields || [];
}

Form.prototype.to_html = function(rowElement) {
  var self = this;
  var markup = '';
  this.fields.forEach(function(field, idx) {
    markup += '<' + self.rowElement
      + (self.rowClass ? ' class="' + self.rowClass + '"' : '')
      + '>';
    markup += field.label();
    markup += field.render();
    markup += '</' + self.rowElement + '>';
  });
  return markup;
}