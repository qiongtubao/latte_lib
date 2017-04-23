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
    it.only("object/set",function(done) {
        var ob = latte_lib.object.create({});
        ob.set("data", { a: 1});
        ob.set("data", { b: 1});
        console.log(ob.get("data").get("b"));
        done();
    });
});