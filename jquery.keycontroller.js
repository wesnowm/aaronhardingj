/*\
|*|  IE-specific polyfill which enables the passage of arbitrary arguments to the
|*|  callback functions of javascript timers (HTML5 standard syntax).
\*/
if (document.all && !window.setTimeout.isPolyfill) {
  var __nativeST__ = window.setTimeout;
  window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setTimeout.isPolyfill = true;
}

if (document.all && !window.setInterval.isPolyfill) {
  var __nativeSI__ = window.setInterval;
  window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setInterval.isPolyfill = true;
}
/**
* KeyController
*
* Offers a continuous key press event on multiple keys at a customised refresh rate. Allows the setting of a different callback function for when the key is pressed and to when it has been released.

* @author Aaron Harding <aaron.harding@graphitedigital.com>
*/
function KeyController() {
	_this = this;
	_this.defaults = {
		'continuous' : false,
		'rate' : 30
	}
	_this.continuousCallsHandler = {};
	_this.activeKeys = {};
	_this.controller = {};
	_this.count = 0;
}
KeyController.prototype = {
	init: function() {
		$(document).keydown(function(event) {
			for (var key in _this.controller) {
				if(_this.controller.hasOwnProperty(key)) {
					var obj = _this.controller[key];
					if(obj.hasOwnProperty("key")) {
						if(obj.key == (event.keyCode || event.which) && !_this.activeKeys[obj.key]) {
							_this.activeKeys[obj.key] = true;
							obj.down();
							if(obj.continuous)
								_this.continuousCallsHandler[obj.key] = setInterval(_this.downKeyCallback, 1000 / obj.rate, obj);
							break;
						}
					}
				}
			}
		});
		$(document).keyup(function(event) {
			for (var key in _this.controller) {
				if(_this.controller.hasOwnProperty(key)) {
					var obj = _this.controller[key];
					if(obj.hasOwnProperty("key")) {
						if(obj.key == (event.keyCode || event.which)) {
							_this.activeKeys[obj.key] = false;
		        			if(obj.up)
		        				obj.up();
		        			break;
						}
					}
				}
			}
		});
	},
	downKeyCallback: function(obj) {
		if (!_this.activeKeys[obj.key])	{
			clearInterval(_this.continuousCallsHandler[obj.key]);
			_this.continuousCallsHandler[obj.key] = null;
		} else {
			obj.down();
		}
	},
	add: function(options) {
		options = $.extend( {}, _this.defaults, options );
		_this.controller[options.key] = options;
	},
};