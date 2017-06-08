/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function() {

  // Invoke strict mode
  "use strict";

  // Create a private object for this library
  useful.polyfills = {

    // enabled the use of HTML5 elements in Internet Explorer
    html5: function() {
      var a, b, elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
      if (navigator.userAgent.match(/msie/gi)) {
        for (a = 0, b = elementsList.length; a < b; a += 1) {
          document.createElement(elementsList[a]);
        }
      }
    },

    // allow array.indexOf in older browsers
    arrayIndexOf: function() {
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
          for (var i = (start || 0), j = this.length; i < j; i += 1) {
            if (this[i] === obj) {
              return i;
            }
          }
          return -1;
        };
      }
    },

    // allow array.isArray in older browsers
    arrayIsArray: function() {
      if (!Array.isArray) {
        Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };
      }
    },

    // allow array.map in older browsers (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    arrayMap: function() {

      // Production steps of ECMA-262, Edition 5, 15.4.4.19
      // Reference: http://es5.github.io/#x15.4.4.19
      if (!Array.prototype.map) {

        Array.prototype.map = function(callback, thisArg) {

          var T, A, k;

          if (this == null) {
            throw new TypeError(' this is null or not defined');
          }

          // 1. Let O be the result of calling ToObject passing the |this|
          //    value as the argument.
          var O = Object(this);

          // 2. Let lenValue be the result of calling the Get internal
          //    method of O with the argument "length".
          // 3. Let len be ToUint32(lenValue).
          var len = O.length >>> 0;

          // 4. If IsCallable(callback) is false, throw a TypeError exception.
          // See: http://es5.github.com/#x9.11
          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }

          // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 1) {
            T = thisArg;
          }

          // 6. Let A be a new array created as if by the expression new Array(len)
          //    where Array is the standard built-in constructor with that name and
          //    len is the value of len.
          A = new Array(len);

          // 7. Let k be 0
          k = 0;

          // 8. Repeat, while k < len
          while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

              // i. Let kValue be the result of calling the Get internal
              //    method of O with argument Pk.
              kValue = O[k];

              // ii. Let mappedValue be the result of calling the Call internal
              //     method of callback with T as the this value and argument
              //     list containing kValue, k, and O.
              mappedValue = callback.call(T, kValue, k, O);

              // iii. Call the DefineOwnProperty internal method of A with arguments
              // Pk, Property Descriptor
              // { Value: mappedValue,
              //   Writable: true,
              //   Enumerable: true,
              //   Configurable: true },
              // and false.

              // In browsers that support Object.defineProperty, use the following:
              // Object.defineProperty(A, k, {
              //   value: mappedValue,
              //   writable: true,
              //   enumerable: true,
              //   configurable: true
              // });

              // For best browser support, use the following:
              A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
          }

          // 9. return A
          return A;
        };
      }

    },

    // allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
    querySelectorAll: function() {
      if (!document.querySelectorAll) {
        document.querySelectorAll = function(a) {
          var b = document,
            c = b.documentElement.firstChild,
            d = b.createElement("STYLE");
          return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
        };
      }
    },

    // allow addEventListener (https://gist.github.com/jonathantneal/3748027)
    addEventListener: function() {
      !window.addEventListener && (function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
        WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
          var target = this;
          registry.unshift([target, type, listener, function(event) {
            event.currentTarget = target;
            event.preventDefault = function() {
              event.returnValue = false;
            };
            event.stopPropagation = function() {
              event.cancelBubble = true;
            };
            event.target = event.srcElement || target;
            listener.call(target, event);
          }]);
          this.attachEvent("on" + type, registry[0][3]);
        };
        WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
          for (var index = 0, register; register = registry[index]; ++index) {
            if (register[0] == this && register[1] == type && register[2] == listener) {
              return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
          }
        };
        WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
          return this.fireEvent("on" + eventObject.type, eventObject);
        };
      })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
    },

    // allow console.log
    consoleLog: function() {
      var overrideTest = new RegExp('console-log', 'i');
      if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
        window.console = {};
        window.console.log = function() {
          // if the reporting panel doesn't exist
          var a, b, messages = '',
            reportPanel = document.getElementById('reportPanel');
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
    objectCreate: function() {
      if (typeof Object.create !== "function") {
        Object.create = function(original) {
          function Clone() {}
          Clone.prototype = original;
          return new Clone();
        };
      }
    },

    // allows String.trim (https://gist.github.com/eliperelman/1035982)
    stringTrim: function() {
      if (!String.prototype.trim) {
        String.prototype.trim = function() {
          return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
        };
      }
      if (!String.prototype.ltrim) {
        String.prototype.ltrim = function() {
          return this.replace(/^\s+/, '');
        };
      }
      if (!String.prototype.rtrim) {
        String.prototype.rtrim = function() {
          return this.replace(/\s+$/, '');
        };
      }
      if (!String.prototype.fulltrim) {
        String.prototype.fulltrim = function() {
          return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        };
      }
    },

    // allows localStorage support
    localStorage: function() {
      if (!window.localStorage) {
        if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)) {
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
    },

    // allows bind support
    functionBind: function() {
      // Credit to Douglas Crockford for this bind method
      if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
          if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
          }
          var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
              return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
          fNOP.prototype = this.prototype;
          fBound.prototype = new fNOP();
          return fBound;
        };
      }
    }

  };

  // startup
  useful.polyfills.html5();
  useful.polyfills.arrayIndexOf();
  useful.polyfills.arrayIsArray();
  useful.polyfills.arrayMap();
  useful.polyfills.querySelectorAll();
  useful.polyfills.addEventListener();
  useful.polyfills.consoleLog();
  useful.polyfills.objectCreate();
  useful.polyfills.stringTrim();
  useful.polyfills.localStorage();
  useful.polyfills.functionBind();

  // return as a require.js module
  if (typeof module !== 'undefined') {
    exports = module.exports = useful.polyfills;
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

	// PROPERTIES
	
	"use strict";
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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Range.Events;
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
useful.Range.prototype.init = function (config) {

	// PROPERTIES
	
	"use strict";

	// METHODS
	
	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this).init();
	};
	
	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// delete the list of elements from the clone
			delete _config.elements;
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context).init();
		}
		// return the instances
		return instances;
	};

	// START

	return (config.elements) ? this.each(config) : this.only(config);

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
useful.Color.prototype.Main = function (config, context) {

	// PROPERTIES
	
	"use strict";
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

	// PROPERTIES
	
	"use strict";
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
		this.config.position = useful.positions.object(this.config.button);
		this.config.limits = useful.positions.window();
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
				rangeInstance = new useful.Range().init({
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
useful.Color.prototype.init = function (config) {

	// PROPERTIES
	
	"use strict";

	// METHODS
	
	this.only = function (config) {
		// start an instance of the script
		return new this.Main(config, this).init();
	};
	
	this.each = function (config) {
		var _config, _context = this, instances = [];
		// for all element
		for (var a = 0, b = config.elements.length; a < b; a += 1) {
			// clone the configuration
			_config = Object.create(config);
			// insert the current element
			_config.element = config.elements[a];
			// delete the list of elements from the clone
			delete _config.elements;
			// start a new instance of the object
			instances[a] = new this.Main(_config, _context).init();
		}
		// return the instances
		return instances;
	};

	// START

	return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Color;
}
