module.exports = require("./basic/lib");
(function() {
	this.async = require("./basic/async");
	this.object = require("./basic/object");
	this.format = require("./basic/format");
	this.events = require("./basic/events");
	this.xhr = require("./test/xhr");
	if(this.env != "web") {
		this.fs = require("./test/fs");
	}

	this.debug = require("./test/debug");
}).call(module.exports);