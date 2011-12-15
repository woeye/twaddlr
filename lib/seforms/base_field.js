module.exports = BaseField;

function BaseField(name, elementName, options) {
  this.name = name;
  this.elementName = elementName;
  this.options = options || {};
  this.options.attributes = options.attributes || {};
}

BaseField.prototype.render = function() {
  var self = this;
  var bodyMarkup = self.options.bodyMarkup || false;

  var markup = '<' + self.elementName;
  var propNames = Object.getOwnPropertyNames(self.options.attributes);
  propNames.forEach(function(name) {
    var value = self.options.attributes[name];
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
    return '<label>' + this.options.label + '</label>';
  }
  return '';
}
