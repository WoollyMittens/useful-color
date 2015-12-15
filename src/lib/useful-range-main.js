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
useful.Range.prototype.Main = function (config, context) {

	// PROPERTIES
	
	"use strict";
	this.parent = parent;
	this.config = config;
	this.context = context;
	this.element = config.element;

	// METHODS
	
	this.init = function () {
		// build the interface
		this.setup();
		// start the updates
		this.update();
		// return the object
		return this;
	};
	
	this.setup = function () {
		// set the initial value, if there isn't one
		this.element.value = this.element.value || 0;
		// measure the dimensions of the parent element if they are not given
		this.config.width = this.config.width || this.element.offsetWidth;
		this.config.height = this.config.height || this.element.offsetHeight;
		// create a container around the element
		this.config.container = document.createElement('span');
		this.config.container.className = 'range';
		// add the container into the label
		this.element.parentNode.insertBefore(this.config.container, this.element);
		// move the input element into the container
		this.config.container.appendChild(this.element.parentNode.removeChild(this.element));
		// add the range rails
		this.config.rails = document.createElement('span');
		this.config.rails.className = 'range_rails';
		this.config.container.appendChild(this.config.rails);
		// add the range button
		this.config.button = document.createElement('span');
		this.config.button.className = 'range_button range_passive';
		this.config.container.appendChild(this.config.button);
		// set the event handler
		this.events = new this.context.Events(this);
		// check of changes
		clearInterval(this.config.interval);
		var _this = this;
		this.config.interval = setInterval(function () {
			_this.update();
		}, 500);
	};
	
	this.update = function () {
		var min, max, value, steps, range;
		// get the attributes from the input element
		min = parseFloat(this.element.getAttribute('min')) || 0;
		max = parseFloat(this.element.getAttribute('max')) || 1;
		steps = parseFloat(this.element.getAttribute('steps')) || 0;
		range = max - min;
		// get the offset of the element
		this.config.offset = useful.positions.object(this.config.container);
		// get the existing value or the fresh input
		value = (this.config.x === null) ?
			parseFloat(this.element.value) :
			(this.config.x - this.config.offset.x) / this.config.container.offsetWidth * range + min;
		// apply any steps to the value
		if (steps) {
			var rounding;
			rounding = value % steps;
			value = (rounding > steps / 2) ?
				value + (steps - rounding) :
				value - rounding;
		}
		// normalize the value
		if (value < min) {
			value = min;
		}
		if (value > max) {
			value = max;
		}
		// set the button position
		this.config.button.style.left = Math.round((value - min) / range * 100) + '%';
		// update the title
		if (this.config.title) {
			this.config.container.setAttribute('title', this.config.title.replace('{value}', Math.round(value)).replace('{min}', min).replace('{max}', max));
		}
		// update the value
		this.element.value = value;
		// trigger any onchange event
		if (this.config.x !== null) {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent('change', false, true);
			this.element.dispatchEvent(evt);
		}
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Range.Main;
}
