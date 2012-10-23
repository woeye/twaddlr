(function() {

	var animIsRunning = false;

	$.fn.css3Animate = function(cssClass, callback) {
		if (animIsRunning) {
			console.log("Another animation is already running! Aborting!");
			return _this;
		}

		var _this = $(this);
		var classes = 'animated ' + cssClass;
		callback = callback || function(){};

		console.log("Starting effect: " + cssClass);

		//console.log($(this));
		//console.log('events before: ', _this.data('events'));
		_this.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
			//console.log('events afterwards: ', _this.data('events'));
			_this.removeClass(classes);
			animIsRunning = false;
			// Unbind events on #main-content
			_this.unbind(); // But not on concrete view divs!!
			callback();
		});
		animIsRunning = true;
		_this.addClass(classes);

		return _this;
	};
})();