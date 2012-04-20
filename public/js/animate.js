(function() {
	$.fn.css3Animate = function(cssClass, callback) {
		var _this = $(this);
		var classes = 'animated ' + cssClass;
		var callback = callback || function(){};

		console.log('starting effect: ' + cssClass);

		//console.log($(this));
		//console.log('events before: ', _this.data('events'));
		_this.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
			//console.log('events afterwards: ', _this.data('events'));
			_this.removeClass(classes);
			
			// Unbind events on #main-content
			_this.unbind(); // But not on concrete view divs!!
			callback();
		});
		_this.addClass(classes);

		return _this;
	};
})();