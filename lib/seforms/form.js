module.exports = Form;

function Form(cfg) {

}

Form.prototype.to_html = function(rowElement) {
	rowElement = rowElement || 'p';

	return '<form></form>';
}