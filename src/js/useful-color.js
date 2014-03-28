/*
	Source:
	van Creij, Maurice (2012). "useful.color.js: Color input element", version 20130510, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Color = function (obj, cfg) {
		this.obj = obj;
		this.cfg = cfg;
		// update cascade
		this.start = function () {
			var context = this;
			// if the browser doesn't support ranges or is compelled to override the native ones
			if (!context.cfg.support) {
				// retrieve starting colour
				context.cfg.color = context.obj.value || context.cfg.color;
				// build the interface
				context.setup(context);
				// start the updates
				context.update(context);
			}
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		this.setup = function (context) {
			// measure the dimensions of the parent element if they are not given
			context.cfg.width = context.cfg.width || context.obj.offsetWidth;
			context.cfg.height = context.cfg.height || context.obj.offsetHeight;
			// create a container around the element
			context.cfg.container = document.createElement('span');
			context.cfg.container.className = 'color';
			// add the container into the label
			context.obj.parentNode.insertBefore(context.cfg.container, context.obj);
			// move the input element into the container
			context.cfg.container.appendChild(context.obj.parentNode.removeChild(context.obj));
			// add the pick button
			context.cfg.button = document.createElement('span');
			context.cfg.button.className = 'color_button color_passive';
			context.cfg.container.appendChild(context.cfg.button);
			// set the event handlers
			context.events.pick(context.cfg.button, context);
			context.events.reset(document.body, context);
			context.events.change(context.obj, context);
		};
		this.update = function (context) {
			// update the color indicator
			context.cfg.button.innerHTML = context.cfg.color;
			context.cfg.button.title = context.cfg.color;
			context.cfg.button.style.backgroundColor = context.cfg.color;
			context.obj.value = context.cfg.color;
			// update the sub-components
			context.popup.update(context);
			// trigger the change event
			context.cfg.onchange();
		};
		this.events = {};
		this.events.change = function (element, context) {
			// set an event handler
			element.addEventListener('change', function () {
				var color;
				// if this appears to be a valid hex string
				color = parseInt(element.value.replace('#', ''), 16);
				if (!isNaN(color) && element.value.match(/#/) && (element.value.length === 4 || element.value.length === 7)) {
					// try to change it into a color
					context.cfg.color = element.value;
					// update the interface
					context.update(context);
				}
			}, false);
		};
		this.events.pick = function (element, context) {
			// set an event handler
			element.addEventListener('click', function (event) {
				// construct the popup
				context.popup.setup(context);
				// cancel the click
				event.preventDefault();
			}, false);
		};
		this.events.reset = function (element, context) {
			element.addEventListener('click', function () {
				// construct the popup
				context.popup.remove(context);
			}, false);
		};
		this.popup = {};
		this.popup.setup = function (context) {
			var color, colors, labelName, inputName, sliderName;
			// remove any existing popup
			if (context.cfg.popup) {
				context.cfg.popup.parentNode.removeChild(context.cfg.popup);
			}
			// reset its hover state
			context.cfg.hover = false;
			// build the popup container
			context.cfg.popup = document.createElement('div');
			context.cfg.popup.className = 'color_popup color_hidden';
			// build the colors UI
			context.cfg.colorInput = document.createElement('fieldset');
			// write the color controls
			colors = {'red' : 'Red: ', 'green' : 'Green: ', 'blue' : 'Blue: '};
			for (color in colors) {
				if (colors.hasOwnProperty(color)) {
					labelName = color + 'Label';
					inputName = color + 'Input';
					sliderName = color + 'Slider';
					context.cfg[labelName] = document.createElement('label');
					context.cfg[labelName].innerHTML = colors[color];
					context.cfg[inputName] = document.createElement('input');
					context.cfg[inputName].setAttribute('type', 'number');
					context.cfg[inputName].setAttribute('name', inputName);
					context.cfg[inputName].setAttribute('min', '0');
					context.cfg[inputName].setAttribute('max', '255');
					context.cfg[inputName].setAttribute('step', '1');
					context.cfg[inputName].setAttribute('value', '127');
					context.cfg[sliderName] = document.createElement('input');
					context.cfg[sliderName].setAttribute('type', 'range');
					context.cfg[sliderName].setAttribute('class', 'range');
					context.cfg[sliderName].setAttribute('name', sliderName);
					context.cfg[sliderName].setAttribute('min', '0');
					context.cfg[sliderName].setAttribute('max', '255');
					context.cfg[sliderName].setAttribute('step', '1');
					context.cfg[sliderName].setAttribute('value', '127');
					context.cfg[labelName].appendChild(context.cfg[inputName]);
					context.cfg.colorInput.appendChild(context.cfg[labelName]);
					context.cfg.colorInput.appendChild(context.cfg[sliderName]);
				}
			}
			// add the color input to the popup
			context.cfg.popup.appendChild(context.cfg.colorInput);
			// insert the popup into the document
			document.body.appendChild(context.cfg.popup);
			// position the popup
			context.cfg.position = useful.positions.object(context.cfg.button);
			context.cfg.limits = useful.positions.window();
			context.cfg.position.x -= (context.cfg.position.x + context.cfg.popup.offsetWidth > context.cfg.limits.x) ? context.cfg.popup.offsetWidth : 0;
			context.cfg.position.y -= (context.cfg.position.y + context.cfg.popup.offsetHeight > context.cfg.limits.y) ? context.cfg.popup.offsetHeight : 0;
			context.cfg.popup.style.left = (context.cfg.position.x + context.cfg.button.offsetWidth) + 'px';
			context.cfg.popup.style.top = (context.cfg.position.y + context.cfg.button.offsetHeight) + 'px';
			// update the popup once
			context.popup.update(context);
			// reveal the popup
			context.popup.reveal(context);
			// set the popup event handlers
			context.popup.events.popUpOver(context.cfg.popup, context);
			context.popup.events.popUpOut(context.cfg.popup, context);
			// invoke the event handlers and fall-back for the sliders
			var rangeInstance, rangeInstances = [];
			for (color in colors) {
				if (colors.hasOwnProperty(color)) {
					inputName = color + 'Input';
					sliderName = color + 'Slider';
					context.popup.events.inputChange(context.cfg[inputName], color, context);
					context.popup.events.sliderChange(context.cfg[sliderName], color, context);
					rangeInstance = new useful.Range(context.cfg[sliderName], {
						'title' : '{value} ({min}-{max})',
						'support' : navigator.userAgent.match(/webkit|opera|msie 10/gi)
					});
					rangeInstance.start();
					rangeInstances.push(rangeInstance);
				}
			}
		};
		this.popup.update = function (context) {
			var red, green, blue;
			// if there is a popup
			if (context.cfg.popup) {
				// if this is a 6 digit color
				if (context.cfg.color.length === 7) {
					// get the red component
					red = parseInt(context.cfg.color.substr(1, 2), 16);
					context.cfg.redInput.value = red;
					context.cfg.redSlider.value = red;
					// get the green component
					green = parseInt(context.cfg.color.substr(3, 2), 16);
					context.cfg.greenInput.value = green;
					context.cfg.greenSlider.value = green;
					// get the blue component
					blue = parseInt(context.cfg.color.substr(5, 2), 16);
					context.cfg.blueInput.value = blue;
					context.cfg.blueSlider.value = blue;
				// else
				} else if (context.cfg.color.length === 4) {
					// get the red component
					red = context.cfg.color.substr(1, 1);
					red = parseInt(red + red, 16);
					context.cfg.redInput.value = red;
					context.cfg.redSlider.value = red;
					// get the green component
					green = context.cfg.color.substr(2, 1);
					green = parseInt(green + green, 16);
					context.cfg.greenInput.value = green;
					context.cfg.greenSlider.value = green;
					// get the blue component
					blue = context.cfg.color.substr(3, 1);
					blue = parseInt(blue + blue, 16);
					context.cfg.blueInput.value = blue;
					context.cfg.blueSlider.value = blue;
				}
			}
		};
		this.popup.convert = function (context) {
			var red, green, blue;
			// update the color picker
			red = parseInt(context.cfg.redInput.value, 10).toString(16);
			red = (red.length === 1) ? '0' + red : red;
			green = parseInt(context.cfg.greenInput.value, 10).toString(16);
			green = (green.length === 1) ? '0' + green : green;
			blue = parseInt(context.cfg.blueInput.value, 10).toString(16);
			blue = (blue.length === 1) ? '0' + blue : blue;
			context.cfg.color = '#' + red + green + blue;
		};
		this.popup.reveal = function (context) {
			// reveal the popup
			setTimeout(function () {
				context.cfg.popup.className = context.cfg.popup.className.replace('color_hidden', 'color_visible');
			}, 100);
		};
		this.popup.remove = function (context) {
			// if the popup exists
			if (context.cfg.popup && !context.cfg.hover) {
				// hide the popup
				context.cfg.popup.className = context.cfg.popup.className.replace('color_visible', 'color_hidden');
			}
		};
		this.popup.events = {};
		this.popup.events.inputChange = function (element, color, context) {
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
				context.cfg[color + 'Input'].value = value;
				context.cfg[color + 'Slider'].value = value;
				// update the stored color
				context.popup.convert(context);
				// update the interface
				context.update(context);
			};
		};
		this.popup.events.sliderChange = function (element, color, context) {
			// set an event handler
			element.onchange = function () {
				// process the value
				context.cfg[color + 'Input'].value = parseInt(element.value, 10);
				// update the stored color
				context.popup.convert(context);
				// update the interface
				context.update(context);
			};
		};
		this.popup.events.popUpOver = function (element, context) {
			// set an event handler
			element.onmouseover = function () {
				// set the hover state
				context.cfg.hover = true;
			};
		};
		this.popup.events.popUpOut = function (element, context) {
			// set an event handler
			element.onmouseout = function () {
				// reset the hover state
				context.cfg.hover = false;
			};
		};
		// go
		this.start();
	};


}(window.useful = window.useful || {}));
