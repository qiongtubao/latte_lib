var md5 = require("../lib/test/md5.js");
describe('object', function() {
    it("md5", function(done) {
        var data = md5.hash("hello");
        console.log(data);
        done();
    });
    
});