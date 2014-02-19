/*
	Source:
	van Creij, Maurice (2012). "useful.range.js: Range input element", version 20130510, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Range = function (obj, cfg) {
		this.obj = obj;
		this.cfg = cfg;
		// update cascade
		this.start = function () {
			var context = this;
			// if the browser doesn't support ranges or is compelled to override the native ones and the element had not been treated before
			if (!context.cfg.support && !context.obj.parentNode.className.match(/range/)) {
				// build the interface
				context.setup(context);
				// start the updates
				context.update(context);
			}
		};
		this.setup = function (context) {
			// set the initial value, if there isn't one
			context.obj.value = context.obj.value || 0;
			// measure the dimensions of the parent element if they are not given
			context.cfg.width = context.cfg.width || context.obj.offsetWidth;
			context.cfg.height = context.cfg.height || context.obj.offsetHeight;
			// create a container around the element
			context.cfg.container = document.createElement('span');
			context.cfg.container.className = 'range';
			// add the container into the label
			context.obj.parentNode.insertBefore(context.cfg.container, context.obj);
			// move the input element into the container
			context.cfg.container.appendChild(context.obj.parentNode.removeChild(context.obj));
			// add the range rails
			context.cfg.rails = document.createElement('span');
			context.cfg.rails.className = 'range_rails';
			context.cfg.container.appendChild(context.cfg.rails);
			// add the range button
			context.cfg.button = document.createElement('span');
			context.cfg.button.className = 'range_button range_passive';
			context.cfg.container.appendChild(context.cfg.button);
			// set the event handler
			context.events.mouse(context.cfg.container, context);
			// check of changes
			clearInterval(context.cfg.interval);
			context.cfg.interval = setInterval(function () {
				context.update(context);
			}, 500);
		};
		this.update = function (context) {
			var min, max, value, steps, range;
			// get the attributes from the input element
			min = parseFloat(context.obj.getAttribute('min')) || 0;
			max = parseFloat(context.obj.getAttribute('max')) || 1;
			steps = parseFloat(context.obj.getAttribute('steps')) || 0;
			range = max - min;
			// get the offset of the element
			context.cfg.offset = useful.positions.object(context.cfg.container);
			// get the existing value or the fresh input
			value = (context.cfg.x === null) ?
				parseFloat(context.obj.value) :
				(context.cfg.x - context.cfg.offset.x) / context.cfg.container.offsetWidth * range + min;
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
			context.cfg.button.style.left = Math.round((value - min) / range * 100) + '%';
			// update the title
			if (context.cfg.title) {
				context.cfg.container.setAttribute('title', context.cfg.title.replace('{value}', Math.round(value)).replace('{min}', min).replace('{max}', max));
			}
			// update the value
			context.obj.value = value;
			// trigger any onchange event
			if (context.cfg.x !== null) {
				var evt = document.createEvent('HTMLEvents');
				evt.initEvent('change', false, true);
				context.obj.dispatchEvent(evt);
			}
		};
		this.events = {};
		this.events.mouse = function (element, context) {
			// initialise coordinates
			context.cfg.x = null;
			context.cfg.reset = null;
			// mouse escapes the element
			element.onmouseout = function () {
				// cancel the previous reset timeout
				clearTimeout(context.cfg.reset);
				// set the reset timeout
				context.cfg.reset = setTimeout(function () {
					// cancel the interaction
					context.cfg.x = null;
					context.cfg.motion = false;
					// deactivate the button
					context.cfg.button.className = context.cfg.button.className.replace('_active', '_passive');
				}, 100);
			};
			element.onmouseover = function () {
				// cancel the previous reset timeout
				clearTimeout(context.cfg.reset);
			};
			// mouse gesture controls
			element.onmousedown = function (event) {
				// get the event properties
				event = event || window.event;
				// store the touch positions
				context.cfg.x = event.pageX || (event.x + context.cfg.offset.x);
				// activate the button
				context.cfg.button.className = context.cfg.button.className.replace('_passive', '_active');
				// update the value
				context.update(context);
				// cancel the click
				return false;
			};
			element.onmousemove = function (event) {
				// get the event properties
				event = event || window.event;
				// if the gesture is active
				if (context.cfg.x !== null) {
					// store the touch positions
					context.cfg.x = event.pageX || (event.x + context.cfg.offset.x);
					// update the value
					context.update(context);
				}
				// cancel the click
				return false;
			};
			element.onmouseup = function (event) {
				// get the event properties
				event = event || window.event;
				// reset the interaction
				context.cfg.x = null;
				// deactivate the button
				context.cfg.button.className = context.cfg.button.className.replace('_active', '_passive');
				// cancel the click
				return false;
			};
		};
	};


}(window.useful = window.useful || {}));
