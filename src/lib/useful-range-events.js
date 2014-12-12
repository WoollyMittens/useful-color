/*
	Source:
	van Creij, Maurice (2014). "useful.range.js: Range input element", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Range = useful.Range || function () {};

// extend the constructor
useful.Range.prototype.Events = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.config = parent.config;
	// methods
	this.mouse = function () {
		var _this = this, element = this.config.container;
		// initialise coordinates
		this.config.x = null;
		this.config.reset = null;
		// mouse escapes the element
		element.onmouseout = function () {
			// cancel the previous reset timeout
			clearTimeout(_this.config.reset);
			// set the reset timeout
			_this.config.reset = setTimeout(function () {
				// cancel the interaction
				_this.config.x = null;
				_this.config.motion = false;
				// deactivate the button
				_this.config.button.className = _this.config.button.className.replace('_active', '_passive');
			}, 100);
		};
		element.onmouseover = function () {
			// cancel the previous reset timeout
			clearTimeout(_this.config.reset);
		};
		// mouse gesture controls
		element.onmousedown = function (event) {
			// get the event properties
			event = event || window.event;
			// store the touch positions
			_this.config.x = event.pageX || (event.x + _this.config.offset.x);
			// activate the button
			_this.config.button.className = _this.config.button.className.replace('_passive', '_active');
			// update the value
			_this.parent.update();
			// cancel the click
			return false;
		};
		element.onmousemove = function (event) {
			// get the event properties
			event = event || window.event;
			// if the gesture is active
			if (_this.config.x !== null) {
				// store the touch positions
				_this.config.x = event.pageX || (event.x + _this.config.offset.x);
				// update the value
				_this.parent.update();
			}
			// cancel the click
			return false;
		};
		element.onmouseup = function (event) {
			// get the event properties
			event = event || window.event;
			// reset the interaction
			_this.config.x = null;
			// deactivate the button
			_this.config.button.className = _this.config.button.className.replace('_active', '_passive');
			// cancel the click
			return false;
		};
	};
	// go
	this.mouse();
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Range.Events;
}
