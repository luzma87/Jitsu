'use strict';

require('../testHelper');

describe('Payment', () => {
  let sandbox;

  const Payment = app.models.Payment;

  describe('createForMonth', () => {

    const month = 1;
    const year = 2018;

    const createPromise = (contents) => {
      return new Promise((resolve, reject) => {
        resolve(contents);
      });
    };

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach((done) => {
      app.dataSources.jitsu.automigrate(function(err) {
        done(err);
      });
      sandbox.restore();
    });

    xit('returns 200', () => {
      expect(false).to.be.true;
    });
  });
});
