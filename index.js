/**
 * node-sass-glob-once
 * Allows two things in imports:
 * - globbing
 * - single imports
 *
 * At this time, node-sass does not allow for multiple chained loaders.
 * I wanted both globbing and single-import preservation, so I made this!
 */

"use strict";

const glob = require("glob");
const path = require("path");
const sass = require("node-sass");

// Hack to keep track of 'sessions'
let usedMap = new Map();

// Normalizes an import path for storage
let normalize = (url) => {
	url = path.normalize(url);

	let parsed = path.parse(url);

	url = url.slice(0, url.length - parsed.ext.length);

	return url;
};

module.exports = function(url, prev, done) {
	// We try to preserve imports within a Sass "session"
	if (!usedMap.has(this.options.importer)) {
		usedMap.set(this.options.importer, new Set());
	}

	let usedSet = usedMap.get(this.options.importer);

	let cwd = this.options.includePaths;
	if (path.isAbsolute(prev)) {
		cwd = path.dirname(prev);
	}

	let root = this.options.includePaths.split(":")[0];

	if (!glob.hasMagic(url)) {
		let fullPath = url;
		if (!path.isAbsolute(url)) {
			fullPath = path.join(root, url);
		}

		fullPath = normalize(fullPath);

		// We've already imported this! Yuck!
		// TODO: add "!multiple" suffix to force import
		if (usedSet.has(fullPath)) {
			return {
				contents: "\n"
			};
		}

		usedSet.add(fullPath);

		return {
			file: url
		};
	}

	glob(path.join(root, url), (err, files) => {
		if (err) {
			// TODO: allow reporting of custom errors?
			return console.error(err);
		}

		let imports = [];

		for (let file of files) {
			// Sass and SCSS syntax, though only SCSS is tested
			if (!/\.s[ac]ss$/.test(file)) {
				continue;
			}

			let fullPath = file;
			if (!path.isAbsolute(file)) {
				fullPath = path.join(cwd, file);
			}

			fullPath = normalize(fullPath);

			let escaped = fullPath.replace(/\\/g, "\\\\");

			imports.push(`@import "${escaped}";${this.options.linefeed}`);
		}

		// Wrap it all up!
		done({
			contents: imports.join("\n")
		});
	});
};