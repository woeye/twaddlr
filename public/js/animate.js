(function() {
	$.fn.css3Animate = function(cssClass, callback) {
		var _this = $(this);
		var classes = 'animated ' + cssClass;
		var callback = callback || function(){};

		console.log('starting effect: ' + cssClass);

		//console.log($(this));
		_this.bind('animationend webkitAnimationEnd oAnimationEnd', function(e) {
			_this.removeClass(classes);
			callback();
		});
		_this.addClass(classes);
		//callback();

		return _this;
	};
})();