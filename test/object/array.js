var object = require('../../index.js').default.object;
var utils = require('../../index.js').default;
var fs = require('fs');
var expect = require('chai').expect;

describe('object', function () {

  it("create", function () {
    var o = object.create({});
    o.set('a', []);
    o.on('change', function (...args) {
      console.log('change', ...args);
    });
    o.get('a').on('splice', function (...args) {
      console.log('aaaaa', ...args);
    });
    o.get('a').push('b');
    o.get('a').push('c');
    o.get('a').push('d');
    o.get('a').splice(1, 1, 'e');
    console.log(o.data);
  });
  // it('createChild', function () {
  //   var o = object.create({});
  //   o.on('key.add', function (value) {
  //     //console.log('add....', value);
  //   });
  //   o.set('key', {});
  //   console.log('1', o.data.key.data, o.toJSON());
  //   o.set('key.add', {});
  //   console.log('2', o.data.key.data.add, o.toJSON());
  // });

});