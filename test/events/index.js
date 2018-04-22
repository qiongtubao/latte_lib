var events = require('../../index.js').default.events;
var utils = require('../../index.js').default;

console.log(events);
describe('event', function () {
  var event = new events();
  var af = function (a) {
    console.log(a);
  };
  it('on', function () {
    event.on('a', af);
  });
  it('emit', function () {
    event.emit('a', 1);
  });
  it('off', function () {
    event.off('a', af);
  });
  it('emit', function () {
    event.emit('a', 2);
  })
});