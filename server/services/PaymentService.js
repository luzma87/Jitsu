'use strict';
const _ = require('lodash');
const moment = require('moment');

/*
-----------------------------------------
{ studentId: 1,
  planId: undefined,
  methodOfPaymentId: undefined,
  year: 2018,
  month: 'enero',
  amountDue: undefined,
  date: null,
  amountPayed: null }
-----------------------------------------
 */

const getMonthlyPayment = (student, month, year) => {
  const methodOfPayment = student.methodOfPayment();
  const plan = student.plan();
  const enrollmentDate = moment(student.enrollmentDate, 'YYYY-MM-DD');
  const enrollmentMonth = enrollmentDate.month() + 1;
  let daysToEndOfMonth = 30 - enrollmentDate.date() + 1;
  let amountDue = plan.price;

  if (daysToEndOfMonth < 0) {
    daysToEndOfMonth = 0;
  }
  if (enrollmentMonth === parseInt(month)) {
    amountDue = _.round(daysToEndOfMonth * plan.price / 30, 2);
  }

  return {
    studentId: student.id,
    planId: plan.id,
    methodOfPaymentId: methodOfPayment.id,
    year: year,
    month: month,
    amountDue: amountDue,
    date: null,
    amountPayed: null,
  };
};

const isStudentCurrentPayment = (payment, studentId, month, year) => {
  return payment.studentId === studentId &&
         payment.month === month &&
         payment.year === year;
};

const getAllMonthlyPayments = (students, monthPayments, month, year) => {
  let allPayments = [];
  students.forEach((student) => {
    const studentPayment = monthPayments.filter((payment) =>
      isStudentCurrentPayment(payment, student.id, month, year));
    if (studentPayment.length === 0) {
      const monthlyPayment = getMonthlyPayment(student, month, year);
      allPayments.push(monthlyPayment);
    }
  });
  return allPayments;
};

module.exports = {
  getMonthlyPayment,
  getAllMonthlyPayments,
};
