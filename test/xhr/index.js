var xhr = require('../../index.js').default.xhr;
var utils = require('../../index.js').default;
var expect = require('chai').expect;

describe('xhr', function () {

  it('getBaidu', function (done) {
    xhr.get('http://www.baidu.com').end((err, res) => {
      console.log(res.text);
      done();
    });
  });

});