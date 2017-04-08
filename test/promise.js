var latte_lib = require("../");
var fs = require("fs");
describe('object', function() {
    it("promise", function(done) {
        latte_lib.promise.FunctionToPromise(fs.readFile, __dirname +"/object.js").then(function(data) {
        	console.log(data);
        	done();
        }, function(err) {
        	console.log(err);
        	done(err);
        });

    });
    
});