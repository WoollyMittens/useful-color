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
