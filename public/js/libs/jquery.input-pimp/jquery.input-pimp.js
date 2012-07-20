(function() {
	$.fn.inputPimp = function() {
		this.focusin(function(e) {
			$(this).prev().toggleClass('focus');
		});
		this.focusout(function(e) {
			$(this).prev().toggleClass('focus');
		});
		this.keydown(function(e) {
			// If there is some text do hide the label
			var _this = $(this);
			setTimeout(function() {
				_this.prev().css('display', e.target.value.length > 0 ? 'none' : 'block');
			}, 0);
		});
	};
})();