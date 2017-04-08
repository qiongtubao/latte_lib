var latte_lib = require("../");
describe('object', function() {
    it("object/add", function(done) {
        var ob = latte_lib.object.create({

        });
        ob.set("a.t.e", "t");
        console.log(ob.get("a").get("t").get("e"));
        done();
    });
    it("object/add", function(done) {
        var ob = latte_lib.object.create({});
        ob.set("a.t.e", "t");
        console.log(ob.get("a").get("t").get("e"));
        done();
    });
});