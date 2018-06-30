'use strict';

const _ = require('lodash');
const Chance = require('chance');

const PaymentService = require('../../server/services/PaymentService');

require('../testHelper');

describe('PaymentService', () => {
  const chance = new Chance();
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach((done) => {
    app.dataSources.jitsu.automigrate(function(err) {
      done(err);
    });
    sandbox.restore();
  });

  const generateDate = (day = '01') => {
    const month = _.padStart(chance.integer({ min: 1, max: 12 }), 2, '0');
    const year = chance.integer({ min: 2000, max: 2020 });
    const enrollmentDate = `${year}-${month}-${day}`;

    return {
      month, year, enrollmentDate,
    };
  };

  const generateStudent = (enrollmentDate) => {
    let studentId = chance.integer();
    let planId = chance.integer();
    let methodOfPaymentId = chance.integer();
    let price = chance.floating({ fixed: 2, min: 10, max: 100 });

    return {
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
  };

  describe('getMonthlyPayment', () => {
    it('should return a full month payment for a given student ' +
       'when enrollment date is the 1st of the month', () => {
      const { month, year, enrollmentDate } = generateDate();
      const student = generateStudent(enrollmentDate);
      const { plan, methodOfPayment } = student;

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: student.id,
        date: null,
        amountDue: plan.price,
        amountPayed: null,
        month: month,
        year: year,
        planId: plan.id,
        methodOfPaymentId: methodOfPayment.id,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });

    it('should return the half the monthly payment' +
       'when enrollment date is the 16h of the current month', () => {
      const { month, year, enrollmentDate } = generateDate(16);
      const student = generateStudent(enrollmentDate);
      const { plan, methodOfPayment } = student;
      const partialPrice = _.round(plan.price / 2, 2);

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: student.id,
        date: null,
        amountDue: partialPrice,
        amountPayed: null,
        month: month,
        year: year,
        planId: plan.id,
        methodOfPaymentId: methodOfPayment.id,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });

    it('should return the correct portion of monthly payment' +
       'for enrollment date assuming 30 days per month', () => {
      let day = chance.integer({ min: 1, max: 28 });
      const parsedDay = _.padStart(day, 2, '0');
      const { month, year, enrollmentDate } = generateDate(parsedDay);
      const student = generateStudent(enrollmentDate);
      const { plan, methodOfPayment } = student;
      const daysToEndOfMonth = 30 - day + 1;
      const partialPrice = _.round(daysToEndOfMonth * plan.price / 30, 2);

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: student.id,
        date: null,
        amountDue: partialPrice,
        amountPayed: null,
        month: month,
        year: year,
        planId: plan.id,
        methodOfPaymentId: methodOfPayment.id,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });

    it('should return a full month payment for a given student ' +
       'when enrollment date is in a previous month', () => {
      const day = _.padStart(chance.integer({ min: 1, max: 28 }), 2, '0');
      const month = _.padStart(chance.integer({ min: 6, max: 12 }), 2, '0');
      const year = chance.integer({ min: 2000, max: 2020 });
      const monthsBefore = chance.integer({ min: 1, max: 5 });
      const enrollmentDate = `${year}-${month - monthsBefore}-${day}`;
      const student = generateStudent(enrollmentDate);
      const { plan, methodOfPayment } = student;

      const payment = PaymentService.getMonthlyPayment(student, month, year);

      const expectedPayment = {
        studentId: student.id,
        date: null,
        amountDue: plan.price,
        amountPayed: null,
        month: month,
        year: year,
        planId: plan.id,
        methodOfPaymentId: methodOfPayment.id,
      };

      expect(payment).to.deep.equal(expectedPayment);
    });
  });
});
