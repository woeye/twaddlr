var TextField = require('./textfield.js'),
    PasswordField = require('./password_field.js'),
    SubmitButton = require('./submit_button.js');

module.exports = Form;

function Form(config) {
  config = config || {};

  this.rowClass = config.rowClass || false;
  this.cssClass = config.class || false;
  this.name = config.name || false;
  this.method = config.method || 'post';
  this.action = config.action || false;
  this.fields = config.fields || [];
  this.formFields = [];

  // Init field values
  var self = this;
  this.fields.forEach(function(field) {
    field.value = field.value || '';

    if (field.type == 'text') {
      self.formFields.push(new TextField(field));
    } else if (field.type === 'submit') {
      self.formFields.push(new SubmitButton('button', field));
    }
  });
}

Form.prototype.to_html = function(rowElement) {
  var self = this;
  rowElement = rowElement || 'p';

  var markup = '<form method="' + this.method + '"';
  markup += (this.action) ? ' action="' + this.action + '"' : '';
  markup += (this.cssClass) ? ' class="' + this.cssClass + '"' : '';
  markup += '>';

  this.formFields.forEach(function(formField, idx) {
    markup += '<' + rowElement
      + (self.rowClass ? ' class="' + self.rowClass + '"' : '')
      + '>';
    markup += formField.label();
    markup += formField.render();
    markup += '</' + rowElement + '>';
  });
  markup += '</form>';
  return markup;

  return '<form></form>';
}