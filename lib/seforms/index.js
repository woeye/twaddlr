/**
 * SEForms - super easy form library
 */

var Form = require('./form.js'),
    TextField = require('./textfield.js'),
    PasswordField = require('./password_field.js'),
    SubmitButton = require('./submit_button.js');

module.exports.createForm = function(config) {
	return new Form(config);
};

/*
exports.Form = Form;
exports.TextField = TextField;
exports.PasswordField = PasswordField;
exports.SubmitButton = SubmitButton;
*/