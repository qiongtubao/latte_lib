var latte_lib = require("../");
describe('object', function() {
	latte_lib.debug.disabled = false;
    it("debug/info", function(done) {
        latte_lib.debug.log("hello");
        done();
    });
    
});