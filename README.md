# node-sass-glob-once
[![npm version](https://img.shields.io/npm/v/node-sass-glob-once.svg)](https://www.npmjs.com/package/node-sass-glob-once)
![node version](https://img.shields.io/node/v/node-sass-glob-once.svg)
![license](https://img.shields.io/github/license/LPGhatguy/node-sass-glob-once.svg)

```sh
npm install node-sass-glob-once
```

This is a module that modifies imports in exactly two ways:
- Import only once
- Allow glob expressions imports

## Requirements
Requires Node >= 5.0.

## Usage
node-sass-glob-once is a node-sass importer.

You can use Sass source like this:
```scss
@import "reset";
@import "components/**/*.scss";

:root {
	font-family: Arial;
}
```

### Node API
```js
const sass = require("node-sass");
const globOnce = require("node-sass-glob-once");

sass.render({
	file: "main.scss",
	{
		importer: [globOnce]
	}
});
```

### gulp-sass
```js
const gulp = require("gulp");
const sass = require("gulp-sass");
const globOnce = require("node-sass-glob-once");

gulp.task("styles", () => {
	return gulp.src("main.scss")
		.pipe(sass({
			importer: [globOnce]
		}))
		.pipe(gulp.dest("css/bundle.css"));
});
```