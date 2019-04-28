/*
	Source:
	van Creij, Maurice (2018). "range.js: Range input element", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Range = function (config) {

	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this);
	};

	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context);
		}
		// return the instances
		return instances;
	};

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Range });
if (typeof module != 'undefined') module.exports = Range;

// extend the class
Range.prototype.Events = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;

	// METHODS

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

// extend the class
Range.prototype.Main = function (config, context) {

	// PROPERTIES

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
		this.config.offset = positions.object(this.config.container);
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

	// EVENTS

	this.init();
};
