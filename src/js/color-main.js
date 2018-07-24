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
