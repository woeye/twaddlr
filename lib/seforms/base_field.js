module.exports = BaseField;

function BaseField(name, elementName, options) {
  this.id = options.id || 'id_' + name;
  this.name = name;
  this.elementName = elementName;
  this.options = options || {};
  this.options.extras = options.extras || {};
}

BaseField.prototype.render = function() {
  var self = this;
  var bodyMarkup = self.options.bodyMarkup || false;

  var markup = '<' + self.elementName;
  markup += ' id="' + this.id + '"';
  markup += ' name="' + this.name + '"';

  var propNames = Object.getOwnPropertyNames(self.options.extras);
  propNames.forEach(function(name) {
    var value = self.options.extras[name];
    markup += ' ' + name + '="' + value + '"';
  });

  if (bodyMarkup) {
    markup += '>' + bodyMarkup + '</' + self.elementName + '>';
  } else {
    markup += '/>';
  }

  return markup;
}

BaseField.prototype.label = function() {
  if (this.options.label) {
    return '<label for="' + this.id + '">' + this.options.label + '</label>';
  }
  return '';
}
