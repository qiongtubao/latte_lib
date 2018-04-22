var format = require('../../index.js').default.format;
var utils = require('../../index.js').default;
var expect = require('chai').expect;
console.log(format);
describe('event', function () {

  it('templateJsonFormat', function () {
    let c = format.templateJsonFormat({
      a: "{{b}}"
    }, {
        b: "hello"
      });
    expect(c.a).to.be.equal("hello");
    expect(c).to.deep.equal({ a: "hello" });
  });
  it('templateStringFormat', function () {
    let c = format.templateStringFormat("{{b}},word!", {
      b: "hello"
    });
    expect(c).to.be.equal("hello,word!");
  });
  it('dateFormat', function () {
    let date = format.dateFormat("yyyy/MM/dd", new Date(1));
    expect(date).to.be.equal("1970/01/01");
  })
  it('getDateReplace', function () {
    let date = format.getDateReplace(new Date(1));
    expect(date.yyyy).to.be.equal("1970");
  })
});