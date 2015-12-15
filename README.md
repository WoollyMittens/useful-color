# useful.color.js: Colour Picker

An alternative for the HTML5 color input element.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=useful-color">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/useful-color.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful-color.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
```

## How to start the script

This method allows CSS Rules to be used to apply the script to one or more nodes at the same time.

```javascript
var colors = new useful.Color().init({
	// elements
	'elements' : document.querySelectorAll('input[type=color]'),
	// initial color
	'color' : '#FF0000',
	// on change event
	'onchange' : function () {}
});
```

**elements : {DOM elements}** - A collection of target elements.

**color : {string}** - A colour in hex format for the placeholder text.

**support : {boolean}** - A test to determine which browsers have native support for the color input element.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp prod` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8000/ .

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
