var object = require('../../index.js').default.object;
var utils = require('../../index.js').default;
var fs = require('fs');
var expect = require('chai').expect;

describe('object', function () {

  it("create", function () {
    var o = object.create({});
    o.set('key', 'value');

  });
  it('createChild', function () {
    var o = object.create({});
    o.on('key.add', function (value) {
      //console.log('add....', value);
    });
    o.set('key', {});
    console.log('1', o.data.key.data, o.toJSON());
    o.set('key.add', {});
    console.log('2', o.data.key.data.add, o.toJSON());
  });

});