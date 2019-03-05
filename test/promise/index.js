var promise = require('../../index.js').default.promise;
var utils = require('../../index.js').default;
var fs = require('fs');
var expect = require('chai').expect;
var readFilePromise = promise.promisify(fs.readFile);
describe('promise', function () {

  it('readFile', function (done) {
    readFilePromise('./index.js').then((result) => {
      return result.toString();
    }).then(result => {
      console.log(result);
      done();
    }).catch(error => {
      console.log('error', error);
      done();
    });
  });
  it('readFileAll', (done) => {
    promise.all([readFilePromise('./index.js'), readFilePromise('./src/index.ts')]).then((result) => {
      console.log('all', result);
      done();
    }).catch((error) => {
      console.log("error", error);
      done();
    })
  });

});