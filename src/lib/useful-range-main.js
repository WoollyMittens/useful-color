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
useful.Range.prototype.Main = function (cfg, parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = cfg;
	this.obj = cfg.element;
	// methods
	this.start = function () {
		// build the interface
		this.setup();
		// start the updates
		this.update();
	};
	this.setup = function () {
		// set the initial value, if there isn't one
		this.obj.value = this.obj.value || 0;
		// measure the dimensions of the parent element if they are not given
		this.cfg.width = this.cfg.width || this.obj.offsetWidth;
		this.cfg.height = this.cfg.height || this.obj.offsetHeight;
		// create a container around the element
		this.cfg.container = document.createElement('span');
		this.cfg.container.className = 'range';
		// add the container into the label
		this.obj.parentNode.insertBefore(this.cfg.container, this.obj);
		// move the input element into the container
		this.cfg.container.appendChild(this.obj.parentNode.removeChild(this.obj));
		// add the range rails
		this.cfg.rails = document.createElement('span');
		this.cfg.rails.className = 'range_rails';
		this.cfg.container.appendChild(this.cfg.rails);
		// add the range button
		this.cfg.button = document.createElement('span');
		this.cfg.button.className = 'range_button range_passive';
		this.cfg.container.appendChild(this.cfg.button);
		// set the event handler
		this.events = new this.parent.Events(this);
		// check of changes
		clearInterval(this.cfg.interval);
		var _this = this;
		this.cfg.interval = setInterval(function () {
			_this.update();
		}, 500);
	};
	this.update = function () {
		var min, max, value, steps, range;
		// get the attributes from the input element
		min = parseFloat(this.obj.getAttribute('min')) || 0;
		max = parseFloat(this.obj.getAttribute('max')) || 1;
		steps = parseFloat(this.obj.getAttribute('steps')) || 0;
		range = max - min;
		// get the offset of the element
		this.cfg.offset = useful.positions.object(this.cfg.container);
		// get the existing value or the fresh input
		value = (this.cfg.x === null) ?
			parseFloat(this.obj.value) :
			(this.cfg.x - this.cfg.offset.x) / this.cfg.container.offsetWidth * range + min;
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
		this.cfg.button.style.left = Math.round((value - min) / range * 100) + '%';
		// update the title
		if (this.cfg.title) {
			this.cfg.container.setAttribute('title', this.cfg.title.replace('{value}', Math.round(value)).replace('{min}', min).replace('{max}', max));
		}
		// update the value
		this.obj.value = value;
		// trigger any onchange event
		if (this.cfg.x !== null) {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent('change', false, true);
			this.obj.dispatchEvent(evt);
		}
	};
	// go
	this.start();
	return this;
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Range;
}
