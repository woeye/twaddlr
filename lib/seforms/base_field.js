module.exports = BaseField;

function BaseField(name, elementName, options) {
  options = options || {};

  this.elementName = elementName;
  this.id = options.id || 'id_' + name;
  this.name = name;
  this.value = options.value || false;
  this.labelString = options.label || false;
  this.bodyMarkup = options.bodyMarkup || false;
  this.extras = options.extras || {};
}

BaseField.prototype.render = function() {
  var self = this;

  var markup = '<' + self.elementName;
  markup += ' id="' + this.id + '"';
  markup += ' name="' + this.name + '"';
  if (this.value) markup += ' value="' + this.value + '"';

  var propNames = Object.getOwnPropertyNames(self.extras);
  propNames.forEach(function(name) {
    var value = self.extras[name];
    markup += ' ' + name + '="' + value + '"';
  });

  if (self.bodyMarkup) {
    markup += '>' + self.bodyMarkup + '</' + self.elementName + '>';
  } else {
    markup += '/>';
  }

  return markup;
}

BaseField.prototype.label = function() {
  if (this.labelString) {
    return '<label for="' + this.id + '">' + this.labelString + '</label>';
  }
  return '';
}
