/* Super easy forms */

var util = require('util');

var exports = module.exports = SEForm;
/*exports.createForm = function(config) {
	return new SEForm(config);
}*/

function TextField(label, attr) {

}
module.exports = TextField;



var rendererForType = {};

function SEForm(config) {
	var self = this;
	config = config || {};

	this.rowClass = config.rowClass || false;
	this.cssClass = config.class || false;
	this.name = config.name || false;
	this.method = config.method || 'post';
	this.action = config.action || false;
	this.fields = config.fields;

	// Init field values
	this.fields.forEach(function(field) {
		field.value = field.value || '';
		//field.class = field.class || false;
		//field.id = field.id || false;
	});
};

SEForm.prototype.as_p = function() {
	return this.to_html('p');
}

SEForm.prototype.as_div = function() {
	return this.to_html('div');
}

SEForm.prototype.to_html = function(rowElement) {
	var self = this;
	rowElement = rowElement || 'p';

	var markup = '<form method="' + this.method + '"';
	markup += (this.action) ? ' action="' + this.action + '"' : '';
	markup += (this.cssClass) ? ' class="' + this.cssClass + '"' : '';
	markup += '>';

	this.fields.forEach(function(field, idx) {
		markup += '<' + rowElement
			+ (self.rowClass ? ' class="' + self.rowClass + '"' : '')
			+ '>';
		markup += rendererForType['label'](field);
		markup += rendererForType[field.type](field);
		markup += '</' + rowElement + '>';
	});
	markup += '</form>';
	return markup;
}

function renderElement(elementName, attributes, body) {
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

function registerRendererForType(type, renderFunc) {
	rendererForType[type] = renderFunc;
}

// Register default renderers
registerRendererForType('label', function(field) {
	if (typeof field.label === undefined) {
		return '';
	}
	return renderElement('label', {}, field.label);
});

registerRendererForType('textField', function(field) {
	var attr = Object.create(field, {
		type: { value: 'text' }
	});
	return renderElement('input', attr);
});

registerRendererForType('passwordField', function(field) {
	var attr = Object.create(field, {
		type: { value: 'password' }
	});
	return renderElement('input', attr);
});

registerRendererForType('submit', function(field) {
	var attr = Object.create(field, {
		type: { value: 'submit' }
	});
	return renderElement('button', attr);
});
