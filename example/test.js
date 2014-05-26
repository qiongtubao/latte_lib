//mocha  test.js
var latte = require("../index");
var assert = require("assert");
describe("latte", function() {
	describe("isArray", function() {
		var a = [];
		var b = 1;
		it(" is array", function() {
			assert.equal(true, latte.isArray(a));
			assert.equal(false, latte.isArray(b));
		});
	});
	describe("isNum", function() {
		var a = 1;
		var b = "wf";
		it(" is num", function() {
			assert.equal(true, latte.isNum(a));
			assert.equal(false, latte.isNum(b));
		});
	});
	describe("clone", function() {
		var a = {
			a:1,
			b:2
		};
		var b = "wf";
		it(" clone", function() {
			assert.equal(false, a == latte.clone(a));
			assert.equal(b, latte.clone(b));
		});
	});
	describe("isFunction", function() {
		var a = function() {

		};
		function b() {

		}
		it(" is function", function() {
			assert.equal(true,  latte.isFunction(a));
			assert.equal(true, latte.isFunction(b));
		});
	});
	describe("arrayRemove", function() {
		var a = [1,2,3,4,5,6];
		it(" arrayRemove ", function(done) {
			latte.arrayRemove(a, 3);
			console.log(a);
			done();
		});
	});
	describe("arrayRemove", function() {
		var a = [1,2,3,4,5,6];
		it(" arrayRemove ", function(done) {
			latte.arrayRemove(a, 3);
			console.log(a);
			done();
		});
	});
	describe("inherits", function() {
		function A() {};
		A.prototype.b = function(){ console.log("class a method b"); };
		function B() {};
		it(" inherits ", function(done) {
			latte.inherits(B,A);
			var b = new B();
			b.b();
			done();
		});
	});
	describe("mergerAll", function() {
		var a = {
			a: 1,
			b:2
		};
		var b = {
			c:3,
			d:4
		};
		var c = {
			e:5,
			f:6
		};
		it(" mergerAll ", function(done) {
			var d = latte.mergerAll(a, b, c);
			console.log(d);
			done();
		});
	});
});