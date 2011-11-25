/* Super easy forms */

var util = require('util');

var renderers = {};

function SEForm(config) {
	var self = this;
	config = config || {};
	
	this.fields = [];
	this.rowCssClass = 'row';
	this.cssClass = config.cssClass;
	this.name = config.name;
	this.method = config.method || 'post';

	if (config.fields) {
		config.fields.forEach(function(field) {
			self.fields.push(new SEField({
				id: 'id_' + field.name,
				name: field.name,
				label: field.label,
				type: field.type,
				value: ''
			}));
		});
	}
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
		//var renderer = renderers[field.type];
		markup += '<' + rowElement 
			+ (self.rowCssClass === undefined ? '' : ' class="' + self.rowCssClass + '"') 
			+ '>';
		markup += field.to_html();
		markup += '</' + rowElement 
			+ (self.rowCssClass === undefined ? '' : ' class="' + self.rowCssClass + '"') 
			+ '>';
	});
	markup += '</form>';
	return markup;
}

function SEField(options) {
	this.id = options.id;
	this.name = options.name;
	this.label = options.label;
	this.type = options.type;
	this.value = options.value;
}

SEField.prototype.to_html = function() {
	return (renderers[this.type](this));
}

function registerRendererForType(type, renderFunc) {
	renderers[type] = renderFunc;
}

// Register default renderers
registerRendererForType('textField', function(field) {
	return '<input type="text" name="' + field.name + '" value="' + field.value + '"/>';
});

var exports = module.exports = SEForm;

exports.createForm = function(config) {
	return new SEForm(config);
}