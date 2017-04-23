
describe('object', function() {
	var latte_lib = require("../");
	latte_lib.debug.disabled = false;
    it("debug/info", function(done) {
        latte_lib.promise.co(function*() {
			var data = yield latte_lib.promise.toPromise(latte_lib.fs.readFile, __dirname +"/object.js");
			return data;
		}).then(function(data) {
			console.log(data);
			done();
		}, function(err) {
			console.log("?!",err);
			done(err);
		});
        
    });
    
});
