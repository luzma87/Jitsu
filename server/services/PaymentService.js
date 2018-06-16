'use strict';
const _ = require('lodash');
const moment = require('moment');

const getMonthlyPayment = (student, month, year) => {
  const enrollmentDate = moment(student.enrollmentDate, 'YYYY-MM-DD');
  let daysToEndOfMonth = 30 - enrollmentDate.date() + 1;
  if (daysToEndOfMonth < 0) {
    daysToEndOfMonth = 0;
  }
  let amountDue = student.plan.price;

  const enrollmentMonth = enrollmentDate.month() + 1;
  if (enrollmentMonth === parseInt(month)) {
    amountDue = _.round(daysToEndOfMonth * student.plan.price / 30, 2);
  }

  return {
    studentId: student.id,
    planId: student.plan.id,
    methodOfPaymentId: student.methodOfPayment.id,
    year: year,
    month: month,
    amountDue: amountDue,
    date: null,
    amountPayed: null,
  };
};

module.exports = {
  getMonthlyPayment: getMonthlyPayment,
};
