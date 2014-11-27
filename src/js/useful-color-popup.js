/*
Source:
van Creij, Maurice (2014). "useful.color.js: Color input element", version 20141127, http://www.woollymittens.nl/.

License:
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Color = useful.Color || function () {};

// extend the constructor
useful.Color.prototype.Popup = function (parent) {
	// properties
	"use strict";
	this.parent = parent;
	this.cfg = parent.cfg;
	this.obj = parent.element;
	// methods
	this.setup = function () {
		var color, colors, labelName, inputName, sliderName;
		// remove any existing popup
		if (this.cfg.modal) {
			this.cfg.modal.parentNode.removeChild(this.cfg.modal);
		}
		// reset its hover state
		this.cfg.hover = false;
		// build the popup container
		this.cfg.modal = document.createElement('div');
		this.cfg.modal.className = 'color_popup color_hidden';
		// build the colors UI
		this.cfg.colorInput = document.createElement('fieldset');
		// write the color controls
		colors = {'red' : 'Red: ', 'green' : 'Green: ', 'blue' : 'Blue: '};
		for (color in colors) {
			if (colors.hasOwnProperty(color)) {
				labelName = color + 'Label';
				inputName = color + 'Input';
				sliderName = color + 'Slider';
				this.cfg[labelName] = document.createElement('label');
				this.cfg[labelName].innerHTML = colors[color];
				this.cfg[inputName] = document.createElement('input');
				this.cfg[inputName].setAttribute('type', 'number');
				this.cfg[inputName].setAttribute('name', inputName);
				this.cfg[inputName].setAttribute('min', '0');
				this.cfg[inputName].setAttribute('max', '255');
				this.cfg[inputName].setAttribute('step', '1');
				this.cfg[inputName].setAttribute('value', '127');
				this.cfg[sliderName] = document.createElement('input');
				this.cfg[sliderName].setAttribute('type', 'range');
				this.cfg[sliderName].setAttribute('class', 'range');
				this.cfg[sliderName].setAttribute('name', sliderName);
				this.cfg[sliderName].setAttribute('min', '0');
				this.cfg[sliderName].setAttribute('max', '255');
				this.cfg[sliderName].setAttribute('step', '1');
				this.cfg[sliderName].setAttribute('value', '127');
				this.cfg[labelName].appendChild(this.cfg[inputName]);
				this.cfg.colorInput.appendChild(this.cfg[labelName]);
				this.cfg.colorInput.appendChild(this.cfg[sliderName]);
			}
		}
		// add the color input to the popup
		this.cfg.modal.appendChild(this.cfg.colorInput);
		// insert the popup into the document
		document.body.appendChild(this.cfg.modal);
		// position the popup
		this.cfg.position = useful.positions.object(this.cfg.button);
		this.cfg.limits = useful.positions.window();
		this.cfg.position.x -= (this.cfg.position.x + this.cfg.modal.offsetWidth > this.cfg.limits.x) ? this.cfg.modal.offsetWidth : 0;
		this.cfg.position.y -= (this.cfg.position.y + this.cfg.modal.offsetHeight > this.cfg.limits.y) ? this.cfg.modal.offsetHeight : 0;
		this.cfg.modal.style.left = (this.cfg.position.x + this.cfg.button.offsetWidth) + 'px';
		this.cfg.modal.style.top = (this.cfg.position.y + this.cfg.button.offsetHeight) + 'px';
		// update the popup once
		this.update();
		// reveal the popup
		this.reveal();
		// set the popup event handlers
		this.handlePopUpOver(this.cfg.modal);
		this.handlePopUpOut(this.cfg.modal);
		// invoke the event handlers and fall-back for the sliders
		var rangeInstance, rangeInstances = [];
		for (color in colors) {
			if (colors.hasOwnProperty(color)) {
				inputName = color + 'Input';
				sliderName = color + 'Slider';
				this.handleInputChange(this.cfg[inputName], color);
				this.handleSliderChange(this.cfg[sliderName], color);
				rangeInstance = new useful.Range().init({
					'elements' : [this.cfg[sliderName]],
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
		if (this.cfg.modal) {
			// if this is a 6 digit color
			if (this.cfg.color.length === 7) {
				// get the red component
				red = parseInt(this.cfg.color.substr(1, 2), 16);
				this.cfg.redInput.value = red;
				this.cfg.redSlider.value = red;
				// get the green component
				green = parseInt(this.cfg.color.substr(3, 2), 16);
				this.cfg.greenInput.value = green;
				this.cfg.greenSlider.value = green;
				// get the blue component
				blue = parseInt(this.cfg.color.substr(5, 2), 16);
				this.cfg.blueInput.value = blue;
				this.cfg.blueSlider.value = blue;
				// else
			} else if (this.cfg.color.length === 4) {
				// get the red component
				red = this.cfg.color.substr(1, 1);
				red = parseInt(red + red, 16);
				this.cfg.redInput.value = red;
				this.cfg.redSlider.value = red;
				// get the green component
				green = this.cfg.color.substr(2, 1);
				green = parseInt(green + green, 16);
				this.cfg.greenInput.value = green;
				this.cfg.greenSlider.value = green;
				// get the blue component
				blue = this.cfg.color.substr(3, 1);
				blue = parseInt(blue + blue, 16);
				this.cfg.blueInput.value = blue;
				this.cfg.blueSlider.value = blue;
			}
		}
	};
	this.convert = function () {
		var red, green, blue;
		// update the color picker
		red = parseInt(this.cfg.redInput.value, 10).toString(16);
		red = (red.length === 1) ? '0' + red : red;
		green = parseInt(this.cfg.greenInput.value, 10).toString(16);
		green = (green.length === 1) ? '0' + green : green;
		blue = parseInt(this.cfg.blueInput.value, 10).toString(16);
		blue = (blue.length === 1) ? '0' + blue : blue;
		this.cfg.color = '#' + red + green + blue;
	};
	this.reveal = function () {
		var _this = this;
		// reveal the popup
		setTimeout(function () {
			_this.cfg.modal.className = _this.cfg.modal.className.replace('color_hidden', 'color_visible');
		}, 100);
	};
	this.remove = function () {
		var _this = this;
		// if the popup exists
		if (this.cfg.modal && !this.cfg.hover) {
			// hide the popup
			this.cfg.modal.className = this.cfg.modal.className.replace('color_visible', 'color_hidden');
		}
	};
	// events
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
			_this.cfg[color + 'Input'].value = value;
			_this.cfg[color + 'Slider'].value = value;
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
			_this.cfg[color + 'Input'].value = parseInt(element.value, 10);
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
			_this.cfg.hover = true;
		};
	};
	this.handlePopUpOut = function (element) {
		var _this = this;
		// set an event handler
		element.onmouseout = function () {
			// reset the hover state
			_this.cfg.hover = false;
		};
	};
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Color.Popup;
}
