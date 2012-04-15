YUI.add('fancy-label', function(Y) {

	console.log('moo');

	function FancyLabelPlugin(config) {
		FancyLabelPlugin.superclass.constructor.apply(this, arguments);
	}

	FancyLabelPlugin.NAME = 'fancyLabelPlugin';
	FancyLabelPlugin.NS = 'fancyLabel';

	Y.extend(FancyLabelPlugin, Y.Plugin.Base, {
		initializer: function(config) {
			var self = this;
			self._node = config.host;
			self._wrapper = self._node.get('parentNode');
			self._label = self._wrapper.one('label');
			self._node.on('focus', function(e) {
				self._wrapper.addClass('focus');
			});
			self._node.on('blur', function(e) {
				self._wrapper.removeClass('focus');
			});

			function checkValue() {	
				setTimeout(function() {
					var display =  self._node.get('value').length > 0 ? 'none' : 'block';
					self._label.setStyle('display', display);
				}, 0);
			}

			self._node.on('keypress', checkValue);
			// In order to listen on backspace keypress events we need the
			// following special code (uses event-key extension)
			self._node.on('key', checkValue, 'down:backspace'); 
		}
	});

	Y.FancyLabelPlugin = FancyLabelPlugin;
}, '1.0.0', {
	requires: ['plugin', 'node-pluginhost', 'event-key']
});
