module.exports = BaseField;

function BaseField(config) {

}

BaseField.prototype.render = function() {
	return 'not implemented';
}

BaseField.prototype.label = function() {
  return '';
}

BaseField.prototype.renderElement = function(elementName, attributes, body) {
	body = body || false;
	attributes = attributes || {};

	var markup = '<' + elementName;
	var propNames = Object.getOwnPropertyNames(attributes);
	propNames.forEach(function(name) {
		var value = attributes[name];
		markup += ' ' + name + '="' + value + '"';
	});
	if (body) {
		markup += '>' + body + '</' + elementName + '>';
	} else {
		markup += '/>';
	}

	return markup;
}
