/* Super easy forms */

var util = require('util');

var exports = module.exports = SEForm;
exports.createForm = function(config) {
	return new SEForm(config);
}

var renderers = {};

function SEForm(config) {
	var self = this;
	config = config || {};
	
	this.rowCssClass = 'row';
	this.cssClass = config.cssClass;
	this.name = config.name;
	this.method = config.method || 'post';
	this.fields = config.fields;

	// Init field values
	this.fields.forEach(function(field) {
		field.value = field.value || '';
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
	var markup = '<form method="' + this.method + '"';
	markup += (this.cssClass === undefined) ? '' : ' class="' + this.cssClass + '"';
	markup += '>';

	this.fields.forEach(function(field ,k) {
		markup += '<' + rowElement 
			+ (self.rowCssClass === undefined ? '' : ' class="' + self.rowCssClass + '"') 
			+ '>';
		markup += renderers['label'](field);
		markup += renderers[field.type](field);
		markup += '</' + rowElement + '>';
	});
	markup += '</form>';
	return markup;
}

function registerRendererForType(type, renderFunc) {
	renderers[type] = renderFunc;
}

// Register default renderers
registerRendererForType('label', function(field) {
	return '<label>' + field.label + '</label>';
});

registerRendererForType('textField', function(field) {
	return '<input type="text" name="' + field.name + '" value="' + field.value + '"/>';
});

registerRendererForType('passwordField', function(field) {
	return '<input type="password" name="' + field.name + '" value="' + field.value + '"/>';
});

