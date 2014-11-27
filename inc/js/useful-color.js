/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.polyfills = {

		// enabled the use of HTML5 elements in Internet Explorer
		html5 : function () {
			var a, b, elementsList;
			elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
			if (navigator.userAgent.match(/msie/gi)) {
				for (a = 0 , b = elementsList.length; a < b; a += 1) {
					document.createElement(elementsList[a]);
				}
			}
		},

		// allow array.indexOf in older browsers
		arrayIndexOf : function () {
			if (!Array.prototype.indexOf) {
				Array.prototype.indexOf = function (obj, start) {
					for (var i = (start || 0), j = this.length; i < j; i += 1) {
						if (this[i] === obj) { return i; }
					}
					return -1;
				};
			}
		},

		// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
		querySelectorAll : function () {
			if (!document.querySelectorAll) {
				document.querySelectorAll = function (a) {
					var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
					return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
				};
			}
		},

		// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
		addEventListener : function () {
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
		},

		// allow console.log
		consoleLog : function () {
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
		},

		// allows Object.create (https://gist.github.com/rxgx/1597825)
		objectCreate : function () {
			if (typeof Object.create !== "function") {
				Object.create = function (original) {
					function Clone() {}
					Clone.prototype = original;
					return new Clone();
				};
			}
		},

		// allows String.trim (https://gist.github.com/eliperelman/1035982)
		stringTrim : function () {
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
		},

		// allows localStorage support
		localStorage : function () {
			if (!window.localStorage) {
				if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)){
					window.localStorage = {
						getItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return null;
							}
							return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
						},
						key: function(nKeyId) {
							return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
						},
						setItem: function(sKey, sValue) {
							if (!sKey) {
								return;
							}
							document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
							this.length = document.cookie.match(/\=/g).length;
						},
						length: 0,
						removeItem: function(sKey) {
							if (!sKey || !this.hasOwnProperty(sKey)) {
								return;
							}
							document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
							this.length--;
						},
						hasOwnProperty: function(sKey) {
							return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
						}
					};
					window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
				} else {
				    Object.defineProperty(window, "localStorage", new(function() {
				        var aKeys = [],
				            oStorage = {};
				        Object.defineProperty(oStorage, "getItem", {
				            value: function(sKey) {
				                return sKey ? this[sKey] : null;
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "key", {
				            value: function(nKeyId) {
				                return aKeys[nKeyId];
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "setItem", {
				            value: function(sKey, sValue) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "length", {
				            get: function() {
				                return aKeys.length;
				            },
				            configurable: false,
				            enumerable: false
				        });
				        Object.defineProperty(oStorage, "removeItem", {
				            value: function(sKey) {
				                if (!sKey) {
				                    return;
				                }
				                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				            },
				            writable: false,
				            configurable: false,
				            enumerable: false
				        });
				        this.get = function() {
				            var iThisIndx;
				            for (var sKey in oStorage) {
				                iThisIndx = aKeys.indexOf(sKey);
				                if (iThisIndx === -1) {
				                    oStorage.setItem(sKey, oStorage[sKey]);
				                } else {
				                    aKeys.splice(iThisIndx, 1);
				                }
				                delete oStorage[sKey];
				            }
				            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
				                oStorage.removeItem(aKeys[0]);
				            }
				            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
				                aCouple = aCouples[nIdx].split(/\s*=\s*/);
				                if (aCouple.length > 1) {
				                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
				                    aKeys.push(iKey);
				                }
				            }
				            return oStorage;
				        };
				        this.configurable = false;
				        this.enumerable = true;
				    })());
				}
			}
		}

	};

	// startup
	useful.polyfills.html5();
	useful.polyfills.arrayIndexOf();
	useful.polyfills.querySelectorAll();
	useful.polyfills.addEventListener();
	useful.polyfills.consoleLog();
	useful.polyfills.objectCreate();
	useful.polyfills.stringTrim();
	useful.polyfills.localStorage();

	// return as a require.js module
	if (typeof module !== 'undefined') {
		exports = module.exports = useful.polyfills;
	}

})();

/*
	Source:
	van Creij, Maurice (2014). "useful.positions.js: A library of useful functions to ease working with screen positions.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function(){

	// Invoke strict mode
	"use strict";

	// Create a private object for this library
	useful.positions = {

		// find the dimensions of the window
		window : function (parent) {
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
		},

		// find the scroll position of an element
		document : function (parent) {
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
		},

		// finds the position of the element, relative to the document
		object : function (node) {
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
		},

		// find the position of the mouse cursor relative to an element
		cursor : function (event, parent) {
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
		exports = module.exports = useful.positions;
	}

})();

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

	this.cfg = parent.cfg;

	// methods

	this.mouse = function () {

		var _this = this, element = this.cfg.container;

		// initialise coordinates

		this.cfg.x = null;

		this.cfg.reset = null;

		// mouse escapes the element

		element.onmouseout = function () {

			// cancel the previous reset timeout

			clearTimeout(_this.cfg.reset);

			// set the reset timeout

			_this.cfg.reset = setTimeout(function () {

				// cancel the interaction

				_this.cfg.x = null;

				_this.cfg.motion = false;

				// deactivate the button

				_this.cfg.button.className = _this.cfg.button.className.replace('_active', '_passive');

			}, 100);

		};

		element.onmouseover = function () {

			// cancel the previous reset timeout

			clearTimeout(_this.cfg.reset);

		};

		// mouse gesture controls

		element.onmousedown = function (event) {

			// get the event properties

			event = event || window.event;

			// store the touch positions

			_this.cfg.x = event.pageX || (event.x + _this.cfg.offset.x);

			// activate the button

			_this.cfg.button.className = _this.cfg.button.className.replace('_passive', '_active');

			// update the value

			_this.parent.update();

			// cancel the click

			return false;

		};

		element.onmousemove = function (event) {

			// get the event properties

			event = event || window.event;

			// if the gesture is active

			if (_this.cfg.x !== null) {

				// store the touch positions

				_this.cfg.x = event.pageX || (event.x + _this.cfg.offset.x);

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

			_this.cfg.x = null;

			// deactivate the button

			_this.cfg.button.className = _this.cfg.button.className.replace('_active', '_passive');

			// cancel the click

			return false;

		};

	};

	// go

	this.mouse();

};



// return as a require.js module

if (typeof module !== 'undefined') {

	exports = module.exports = useful.Range;

}


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

useful.Range.prototype.Main = function (parent, cfg) {

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

useful.Range.prototype.init = function (cfg) {

	// properties

	"use strict";

	this.instances = [];

	// methods

	this.each = function (elements, cfg) {

		var _cfg, instance;

		// for all elements

		for (var a = 0, b = elements.length; a < b; a += 1) {

			// clone the configuration

			_cfg = Object.create(cfg);

			// insert the current element

			_cfg.element = elements[a];

			// start a new instance of the object

			this.instances.push(new this.Main(this, _cfg));

		}

	};

	// go

	this.each(cfg.elements, cfg);

	this.init = function () {};

	return this;

};



// return as a require.js module

if (typeof module !== 'undefined') {

	exports = module.exports = useful.Range;

}


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

useful.Color.prototype.Main = function (parent, cfg) {

	// properties

	"use strict";

	this.parent = parent;

	this.cfg = cfg;

	this.obj = cfg.element;

	// methods

	this.start = function () {

		var context = this;

		// retrieve starting colour

		this.cfg.color = this.obj.value || this.cfg.color;

		// build the interface

		this.setup();

		// start the updates

		this.update();

	};

	this.setup = function () {

		// measure the dimensions of the parent element if they are not given

		this.cfg.width = this.cfg.width || this.obj.offsetWidth;

		this.cfg.height = this.cfg.height || this.obj.offsetHeight;

		// create a container around the element

		this.cfg.container = document.createElement('span');

		this.cfg.container.className = 'color';

		// add the container into the label

		this.obj.parentNode.insertBefore(this.cfg.container, this.obj);

		// move the input element into the container

		this.cfg.container.appendChild(this.obj.parentNode.removeChild(this.obj));

		// add the pick button

		this.cfg.button = document.createElement('span');

		this.cfg.button.className = 'color_button color_passive';

		this.cfg.container.appendChild(this.cfg.button);

		// set the event handlers

		this.handlePick(this.cfg.button);

		this.handleReset(document.body);

		this.handleChange(this.obj);

	};

	this.update = function () {

		// update the color indicator

		this.cfg.button.innerHTML = this.cfg.color;

		this.cfg.button.title = this.cfg.color;

		this.cfg.button.style.backgroundColor = this.cfg.color;

		this.obj.value = this.cfg.color;

		// update the sub-components

		this.popup.update();

		// trigger the change event

		this.cfg.onchange();

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

				_this.cfg.color = element.value;

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

	// components

	this.popup = new this.parent.Popup(this);

	// go

	this.start();

	return this;

};



// return as a require.js module

if (typeof module !== 'undefined') {

	exports = module.exports = useful.Color.Main;

}


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

useful.Color.prototype.init = function (cfg) {

	// properties

	"use strict";

	this.instances = [];

	// methods

	this.each = function (elements, cfg) {

		var _cfg, instance;

		// for all elements

		for (var a = 0, b = elements.length; a < b; a += 1) {

			// clone the configuration

			_cfg = Object.create(cfg);

			// insert the current element

			_cfg.element = elements[a];

			// start a new instance of the object

			this.instances.push(new this.Main(this, _cfg));

		}

	};

	// go

	this.each(cfg.elements, cfg);

	this.init = function () {};

	return this;

};



// return as a require.js module

if (typeof module !== 'undefined') {

	exports = module.exports = useful.Color;

}

