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
