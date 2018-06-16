'use strict';

const _ = require('lodash');
const Chance = require('chance');

const PaymentService = require('../../server/services/PaymentService');

require('../testHelper');

describe('PaymentService', () => {
  const chance = new Chance();
  let sandbox,
    studentId,
    planId,
    methodOfPaymentId,
    price;

  beforeEach(() => {
    studentId = chance.integer();
    planId = chance.integer();
    methodOfPaymentId = chance.integer();
    price = chance.floating({fixed: 2, min: 10, max: 100});

    sandbox = sinon.createSandbox();
  });

  afterEach((done) => {
    app.dataSources.jitsu.automigrate(function(err) {
      done(err);
    });
    sandbox.restore();
  });

  describe('createStudentMonthlyPayment', () => {
    it('should return a full month payment for a given student ' +
       'when enrollment date is the 1st of the month', () => {
      const day = '01';
      const month = _.padStart(chance.integer({min: 1, max: 12}), 2, '0');
      const year = chance.integer({min: 2000, max: 2020});
      const enrollmentDate = `${year}-${month}-${day}`;

      const student = {
        id: studentId,
        enrollmentDate,
        plan: {
          id: planId,
          price,
        },
        methodOfPayment: {
          id: methodOfPaymentId,
        },
      };

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: studentId,
        date: null,
        amountDue: price,
        amountPayed: null,
        month: month,
        year: year,
        planId: planId,
        methodOfPaymentId: methodOfPaymentId,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });

    it('should return the half the monthly payment' +
       'when enrollment date is the 16h of the current month', () => {
      const day = 16;
      const month = _.padStart(chance.integer({min: 1, max: 12}), 2, '0');
      const year = chance.integer({min: 2000, max: 2020});
      const enrollmentDate = `${year}-${month}-${day}`;
      const partialPrice = _.round(price / 2, 2);

      const student = {
        id: studentId,
        enrollmentDate,
        plan: {
          id: planId,
          price,
        },
        methodOfPayment: {
          id: methodOfPaymentId,
        },
      };

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: studentId,
        date: null,
        amountDue: partialPrice,
        amountPayed: null,
        month: month,
        year: year,
        planId: planId,
        methodOfPaymentId: methodOfPaymentId,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });

    it('should return the correct portion of monthly payment' +
       'for enrollment date assuming 30 days per month', () => {
      let day = chance.integer({min: 1, max: 28});
      const parsedDay = _.padStart(day, 2, '0');
      const month = _.padStart(chance.integer({min: 1, max: 12}), 2, '0');
      const year = chance.integer({min: 2000, max: 2020});
      const enrollmentDate = `${year}-${month}-${parsedDay}`;
      let daysToEndOfMonth = 30 - day + 1;
      const partialPrice = _.round(daysToEndOfMonth * price / 30, 2);

      const student = {
        id: studentId,
        enrollmentDate,
        plan: {
          id: planId,
          price,
        },
        methodOfPayment: {
          id: methodOfPaymentId,
        },
      };

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: studentId,
        date: null,
        amountDue: partialPrice,
        amountPayed: null,
        month: month,
        year: year,
        planId: planId,
        methodOfPaymentId: methodOfPaymentId,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });

    it('should return a full month payment for a given student ' +
       'when enrollment date is in a previous month', () => {
      const day = _.padStart(chance.integer({min: 1, max: 28}), 2, '0');
      const month = _.padStart(chance.integer({min: 6, max: 12}), 2, '0');
      const year = chance.integer({min: 2000, max: 2020});
      const monthsBefore = chance.integer({min: 1, max: 5});
      const enrollmentDate = `${year}-${month - monthsBefore}-${day}`;

      const student = {
        id: studentId,
        enrollmentDate,
        plan: {
          id: planId,
          price,
        },
        methodOfPayment: {
          id: methodOfPaymentId,
        },
      };

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: studentId,
        date: null,
        amountDue: price,
        amountPayed: null,
        month: month,
        year: year,
        planId: planId,
        methodOfPaymentId: methodOfPaymentId,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });
  });
});
