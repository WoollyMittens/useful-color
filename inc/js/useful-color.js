/*
	Source:
	van Creij, Maurice (2012). "useful.instances.js: A library of useful functions to ease working with instances of constructors.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Usage:
	var instances = new useful.Instances(document.querySelectorAll('#id.classname'), Constructor, {'foo':'bar'});
	object = instances.getByObject(element);
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// public functions
	useful.Instances = function (objs, constructor, cfg) {
		// properties
		this.objs = objs;
		this.constructor = constructor;
		this.cfg = cfg;
		this.constructs = [];
		// starts and stores an instance of the constructor for every element
		this.start = function () {
			for (var a = 0, b = this.objs.length; a < b; a += 1) {
				// store a constructed instance with cloned cfg object
				this.constructs[a] = new this.constructor(this.objs[a], Object.create(this.cfg));
			}
			// disable the start function so it can't be started twice
			this.start = function () {};
			// empty the timeout
			return null;
		};
		// returns the constructs
		this.getAll = function () {
			return this.constructs;
		};
		// returns the object that goes with the element
		this.getByObject = function (element) {
			return this.constructs[this.constructs.indexOf(element)];
		};
		// returns the object that goes with the index
		this.getByIndex = function (index) {
			return this.constructs[index];
		};
		this.start();
	};

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		var overrideTest = new RegExp('console-log', 'i');
		if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// add a break after the message
				messages += '<hr/>';
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.positions.js: A library of useful functions to ease working with screen positions.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var positions = positions || {};

	// find the dimensions of the window
	positions.window = function (parent) {
		// define a position object
		var dimensions = {x : 0, y : 0};
		// if an alternative was given to use as a window
		if (parent && parent !== window) {
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
	};

	// find the scroll position of an element
	positions.document = function (parent) {
		// define a position object
		var position = {x : 0, y : 0};
		// find the current position in the document
		if (parent && parent !== window) {
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
	};

	// finds the position of the element, relative to the document
	positions.object = function (node) {
		// define a position object
		var position = {x : 0, y : 0};
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
	};

	// find the position of the mouse cursor relative to an element
	positions.cursor = function (event, parent) {
		// get the event properties
		event = event || window.event;
		// define a position object
		var position = {x : 0, y : 0};
		// find the current position on the document
		position.x = event.pageX || event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		position.y = event.pageY || event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		// if a parent was given
		if (parent) {
			// retrieve the position of the parent
			var offsets = positions.object(parent);
			// adjust the coordinates to fit the parent
			position.x -= offsets.x;
			position.y -= offsets.y;
		}
		// return the object
		return position;
	};

	// public functions
	useful.positions = useful.positions || {};
	useful.positions.window = positions.window;
	useful.positions.document = positions.document;
	useful.positions.object = positions.object;
	useful.positions.cursor = positions.cursor;

}(window.useful = window.useful || {}));

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
			// build the interface
			context.setup(context);
			// start the updates
			context.update(context);
			// disable the start function so it can't be started twice
			this.start = function () {};
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
		// go
		this.start();
	};


}(window.useful = window.useful || {}));

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
			// retrieve starting colour
			context.cfg.color = context.obj.value || context.cfg.color;
			// build the interface
			context.setup(context);
			// start the updates
			context.update(context);
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
