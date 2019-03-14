/*
Source:
van Creij, Maurice (2018). "positions.js: A library of useful functions to ease working with screen positions.", http://www.woollymittens.nl/.

License:
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var positions = {

	// find the dimensions of the window
	window: function (parent) {
		// define a position object
		var dimensions = {x: 0, y: 0};
		// if an alternative was given to use as a window
		if (parent && parent !== window && parent !== document) {
			// find the current dimensions of surrogate window
			dimensions.x = parent.offsetWidth;
			dimensions.y = parent.offsetHeight;
		} else {
			// find the current dimensions of the window
			dimensions.x = window.innerWidth || document.body.clientWidth;
			dimensions.y = window.innerHeight || document.body.clientHeight;
		}
		// return the object
		return dimensions;
	},

	// find the scroll position of an element
	document: function (parent) {
		// define a position object
		var position = {x: 0, y: 0};
		// find the current position in the document
		if (parent && parent !== window && parent !== document) {
			position.x = parent.scrollLeft;
			position.y = parent.scrollTop;
		} else {
			position.x = (window.pageXOffset) ?
			window.pageXOffset :
			(document.documentElement) ?
			document.documentElement.scrollLeft :
			document.body.scrollLeft;
			position.y = (window.pageYOffset) ?
			window.pageYOffset :
			(document.documentElement) ?
			document.documentElement.scrollTop :
			document.body.scrollTop;
		}
		// return the object
		return position;
	},

	// finds the position of the element, relative to the document
	object: function (node) {
		// define a position object
		var position = {x: 0, y: 0};
		// if offsetparent exists
		if (node.offsetParent) {
			// add every parent's offset
			while (node.offsetParent) {
				position.x += node.offsetLeft;
				position.y += node.offsetTop;
				node = node.offsetParent;
			}
		}
		// return the object
		return position;
	},

	// find the position of the mouse cursor relative to an element
	cursor: function (evt, parent) {
		// define a position object
		var position = {x: 0, y: 0};
		// find the current position on the document
		if (evt.touches && evt.touches[0]) {
			position.x = evt.touches[0].pageX;
			position.y = evt.touches[0].pageY;
		} else if (evt.pageX !== undefined) {
			position.x = evt.pageX;
			position.y = evt.pageY;
		} else {
			position.x = evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
			position.y = evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
		}
		// if a parent was given
		if (parent) {
			// retrieve the position of the parent
			var offsets = this.object(parent);
			// adjust the coordinates to fit the parent
			position.x -= offsets.x;
			position.y -= offsets.y;
		}
		// return the object
		return position;
	}

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = positions;
}

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
if (typeof module !== 'undefined') {
	exports = module.exports = Range;
}

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

/*
Source:
van Creij, Maurice (2018). "color.js: Color input element", http://www.woollymittens.nl/.

License:
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Color = function (config) {

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
if (typeof define != 'undefined') define(['color'], function () { return Color });
if (typeof module != 'undefined') module.exports = Color;

// extend the class
Color.prototype.Main = function (config, context) {

	// PROPERTIES

	this.config = config;
	this.context = context;
	this.element = config.element;

	// METHODS

	this.init = function () {
		// retrieve starting colour
		this.config.color = this.element.value || this.config.color;
		// build the interface
		this.setup();
		// start the updates
		this.update();
		// return the object
		return this;
	};

	this.setup = function () {
		// measure the dimensions of the parent element if they are not given
		this.config.width = this.config.width || this.element.offsetWidth;
		this.config.height = this.config.height || this.element.offsetHeight;
		// create a container around the element
		this.config.container = document.createElement('span');
		this.config.container.className = 'color';
		// add the container into the label
		this.element.parentNode.insertBefore(this.config.container, this.element);
		// move the input element into the container
		this.config.container.appendChild(this.element.parentNode.removeChild(this.element));
		// add the pick button
		this.config.button = document.createElement('span');
		this.config.button.className = 'color_button color_passive';
		this.config.container.appendChild(this.config.button);
		// set the event handlers
		this.handlePick(this.config.button);
		this.handleReset(document.body);
		this.handleChange(this.element);
	};

	this.update = function () {
		// update the color indicator
		this.config.button.innerHTML = this.config.color;
		this.config.button.title = this.config.color;
		this.config.button.style.backgroundColor = this.config.color;
		this.element.value = this.config.color;
		// update the sub-components
		this.popup.update();
		// trigger the change event
		this.config.onchange();
	};

	this.handleChange = function (element) {
		var _this = this;
		// set an event handler
		element.addEventListener('change', function () {
			var color;
			// if this appears to be a valid hex string
			color = parseInt(element.value.replace('#', ''), 16);
			if (!isNaN(color) && element.value.match(/#/) && (element.value.length === 4 || element.value.length === 7)) {
				// try to change it into a color
				_this.config.color = element.value;
				// update the interface
				_this.update();
			}
		}, false);
	};

	this.handlePick = function (element) {
		var _this = this;
		// set an event handler
		element.addEventListener('click', function (event) {
			// construct the popup
			_this.popup.setup();
			// cancel the click
			event.preventDefault();
		}, false);
	};

	this.handleReset = function (element) {
		var _this = this;
		element.addEventListener('click', function () {
			// construct the popup
			_this.popup.remove();
		}, false);
	};

	// COMPONENTS

	this.popup = new this.context.Popup(this);

	// EVENTS

	this.init();

};

// extend the class
Color.prototype.Popup = function (parent) {

	// PROPERTIES

	this.parent = parent;
	this.config = parent.config;
	this.element = parent.element;

	// METHODS

	this.setup = function () {
		var color, colors, labelName, inputName, sliderName;
		// remove any existing popup
		if (this.config.modal) {
			this.config.modal.parentNode.removeChild(this.config.modal);
		}
		// reset its hover state
		this.config.hover = false;
		// build the popup container
		this.config.modal = document.createElement('div');
		this.config.modal.className = 'color_popup color_hidden';
		// build the colors UI
		this.config.colorInput = document.createElement('fieldset');
		// write the color controls
		colors = {'red' : 'Red: ', 'green' : 'Green: ', 'blue' : 'Blue: '};
		for (color in colors) {
			if (colors.hasOwnProperty(color)) {
				labelName = color + 'Label';
				inputName = color + 'Input';
				sliderName = color + 'Slider';
				this.config[labelName] = document.createElement('label');
				this.config[labelName].innerHTML = colors[color];
				this.config[inputName] = document.createElement('input');
				this.config[inputName].setAttribute('type', 'number');
				this.config[inputName].setAttribute('name', inputName);
				this.config[inputName].setAttribute('min', '0');
				this.config[inputName].setAttribute('max', '255');
				this.config[inputName].setAttribute('step', '1');
				this.config[inputName].setAttribute('value', '127');
				this.config[sliderName] = document.createElement('input');
				this.config[sliderName].setAttribute('type', 'range');
				this.config[sliderName].setAttribute('class', 'range');
				this.config[sliderName].setAttribute('name', sliderName);
				this.config[sliderName].setAttribute('min', '0');
				this.config[sliderName].setAttribute('max', '255');
				this.config[sliderName].setAttribute('step', '1');
				this.config[sliderName].setAttribute('value', '127');
				this.config[labelName].appendChild(this.config[inputName]);
				this.config.colorInput.appendChild(this.config[labelName]);
				this.config.colorInput.appendChild(this.config[sliderName]);
			}
		}
		// add the color input to the popup
		this.config.modal.appendChild(this.config.colorInput);
		// insert the popup into the document
		document.body.appendChild(this.config.modal);
		// position the popup
		this.config.position = positions.object(this.config.button);
		this.config.limits = positions.window();
		this.config.position.x -= (this.config.position.x + this.config.modal.offsetWidth > this.config.limits.x) ? this.config.modal.offsetWidth : 0;
		this.config.position.y -= (this.config.position.y + this.config.modal.offsetHeight > this.config.limits.y) ? this.config.modal.offsetHeight : 0;
		this.config.modal.style.left = (this.config.position.x + this.config.button.offsetWidth) + 'px';
		this.config.modal.style.top = (this.config.position.y + this.config.button.offsetHeight) + 'px';
		// update the popup once
		this.update();
		// reveal the popup
		this.reveal();
		// set the popup event handlers
		this.handlePopUpOver(this.config.modal);
		this.handlePopUpOut(this.config.modal);
		// invoke the event handlers and fall-back for the sliders
		var rangeInstance, rangeInstances = [];
		for (color in colors) {
			if (colors.hasOwnProperty(color)) {
				inputName = color + 'Input';
				sliderName = color + 'Slider';
				this.handleInputChange(this.config[inputName], color);
				this.handleSliderChange(this.config[sliderName], color);
				rangeInstance = new Range({
					'elements' : [this.config[sliderName]],
					'title' : '{value} ({min}-{max})',
					'support' : navigator.userAgent.match(/webkit|opera|msie 10/gi)
				});
				rangeInstances.push(rangeInstance);
			}
		}
	};

	this.update = function () {
		var red, green, blue;
		// if there is a popup
		if (this.config.modal) {
			// if this is a 6 digit color
			if (this.config.color.length === 7) {
				// get the red component
				red = parseInt(this.config.color.substr(1, 2), 16);
				this.config.redInput.value = red;
				this.config.redSlider.value = red;
				// get the green component
				green = parseInt(this.config.color.substr(3, 2), 16);
				this.config.greenInput.value = green;
				this.config.greenSlider.value = green;
				// get the blue component
				blue = parseInt(this.config.color.substr(5, 2), 16);
				this.config.blueInput.value = blue;
				this.config.blueSlider.value = blue;
				// else
			} else if (this.config.color.length === 4) {
				// get the red component
				red = this.config.color.substr(1, 1);
				red = parseInt(red + red, 16);
				this.config.redInput.value = red;
				this.config.redSlider.value = red;
				// get the green component
				green = this.config.color.substr(2, 1);
				green = parseInt(green + green, 16);
				this.config.greenInput.value = green;
				this.config.greenSlider.value = green;
				// get the blue component
				blue = this.config.color.substr(3, 1);
				blue = parseInt(blue + blue, 16);
				this.config.blueInput.value = blue;
				this.config.blueSlider.value = blue;
			}
		}
	};

	this.convert = function () {
		var red, green, blue;
		// update the color picker
		red = parseInt(this.config.redInput.value, 10).toString(16);
		red = (red.length === 1) ? '0' + red : red;
		green = parseInt(this.config.greenInput.value, 10).toString(16);
		green = (green.length === 1) ? '0' + green : green;
		blue = parseInt(this.config.blueInput.value, 10).toString(16);
		blue = (blue.length === 1) ? '0' + blue : blue;
		this.config.color = '#' + red + green + blue;
	};

	this.reveal = function () {
		var _this = this;
		// reveal the popup
		setTimeout(function () {
			_this.config.modal.className = _this.config.modal.className.replace('color_hidden', 'color_visible');
		}, 100);
	};

	this.remove = function () {
		var _this = this;
		// if the popup exists
		if (this.config.modal && !this.config.hover) {
			// hide the popup
			this.config.modal.className = this.config.modal.className.replace('color_visible', 'color_hidden');
		}
	};

	// EVENTS

	this.handleInputChange = function (element, color) {
		var _this = this;
		// set an event handler
		element.onchange = function () {
			var min, max, value;
			// process the value
			value = parseInt(element.value, 10);
			min = parseFloat(element.getAttribute('min'));
			max = parseFloat(element.getAttribute('max'));
			if (isNaN(value)) {
				value = 0;
			}
			if (value < min) {
				value = min;
			}
			if (value > max) {
				value = max;
			}
			// apply the value
			_this.config[color + 'Input'].value = value;
			_this.config[color + 'Slider'].value = value;
			// update the stored color
			_this.convert();
			// update the interface
			_this.parent.update();
		};
	};

	this.handleSliderChange = function (element, color) {
		var _this = this;
		// set an event handler
		element.onchange = function () {
			// process the value
			_this.config[color + 'Input'].value = parseInt(element.value, 10);
			// update the stored color
			_this.convert();
			// update the interface
			_this.parent.update();
		};
	};

	this.handlePopUpOver = function (element) {
		var _this = this;
		// set an event handler
		element.onmouseover = function () {
			// set the hover state
			_this.config.hover = true;
		};
	};

	this.handlePopUpOut = function (element) {
		var _this = this;
		// set an event handler
		element.onmouseout = function () {
			// reset the hover state
			_this.config.hover = false;
		};
	};
};
