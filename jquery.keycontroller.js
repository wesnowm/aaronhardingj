/**
* KeyController
*
* Offers a continuous key press event on multiple keys at a customised refresh rate. Allows the setting of a different callback function for when the key is pressed and to when it has been released.

* @author Aaron Harding <aaron.harding@graphitedigital.com>
*/
function KeyController(repeat, repeatDelay) {
	this.defaults = {
		'repeat' : repeat || false,
		'repeatDelay' : repeatDelay || 30
	}
	this.repeatedCallsHandler = {};
	this.activeKeys = {};
}
KeyController.prototype = {

	add: function(options) {

		function triggerDownKeyCallback() {
			if (!KeyController.activeKeys[options.key])
			{
				clearInterval(KeyController.repeatedCallsHandler[options.key]);
				KeyController.repeatedCallsHandler[options.key] = null;
			} else {
				options.down();
			}
		}

		options = $.extend( {}, KeyController.defaults, options );

		$(document).keydown(function(event) {

		    if((event.keyCode || event.which) === options.key && !KeyController.activeKeys[options.key])
		    {
		    	if(options.repeat)
		    		KeyController.repeatedCallsHandler[options.key] = setInterval(triggerDownKeyCallback, 1 / options.repeatDelay);
		    	else
		    		triggerDownKeyCallback();

		        KeyController.activeKeys[options.key] = true;
		    }

			return;
		});

		$(document).keyup(function(event) {
		    if(event.keyCode === options.key) {
		        KeyController.activeKeys[options.key] = false;
		        if(!options.repeat && options.up) options.up();
		    }
		});
	},
};