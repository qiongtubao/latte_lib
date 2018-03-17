var xhr = require("../lib/test/xhr.js");
describe('object', function() {
    it("get", function(done) {
       	xhr.get('http://127.0.0.1:8999/latte_editor', {a: 1}, function(err, data) {
       		console.log(err, data);
       		done();
       	});
        
    });
    
});