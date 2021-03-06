'use strict';
const moment = require('moment');

const PaymentService = require('../services/PaymentService');
const responseHelper = require('../utils/responseHelper');

module.exports = function(Payment) {
  Payment.disableRemoteMethodByName('deleteById');

  Payment.createForMonth = async (params) => {
    console.log('Create for month', params);
    const month = parseInt(params.month);
    const year = parseInt(params.year);
    const Student = Payment.app.models.Student;
    let monthPayments, students;

    const lastDayOfMonth = moment(`10/${month}/${year}`, 'DD/M/YYYY').endOf('month');
    const studentsFilter = {
      where: {
        isActive: true,
        enrollmentDate: {
          lte: lastDayOfMonth,
        },
      },
      include: [
        'plan',
        'methodOfPayment',
      ],
    };

    try {
      monthPayments = await Payment.find({ where: { month, year } });
    } catch (err) {
      responseHelper.throwError(err, 'Error buscando pagos');
    }
    try {
      students = await Student.find(studentsFilter);
    } catch (err) {
      responseHelper.throwError(err, 'Error buscando estudiantes');
    }

    const allPayments = PaymentService.getAllMonthlyPayments(students, monthPayments, month, year);
    try {
      await Payment.create(allPayments);
    } catch (err) {
      responseHelper.throwError(err, 'Error insertando pagos');
    }

    let payments;
    try {
      payments = await Payment.find({
        where: { month, year },
        include: ['student', 'plan', 'methodOfPayment'],
      });
    } catch (err) {
      responseHelper.throwError(err, 'Error buscando pagos');
    }
    return responseHelper.buildResponse(payments, 201);
  };

  // Payment.createMultipleForStudent = async (params) => {
  //   const date = params.date; //fecha q realiza el pago
  //   const months = params.months; //cuantos meses esta pagando a la vez
  //   const student = params.student;
  //
  //   /*
  //     busco el estudiante
  //     busco el valor del plan del estudiante
  //     genero el cobro parcial a partir de date (para month[0])
  //     months-1 veces n=>
  //       busco en pagos por mes/año/estudiante
  //         si esta => return
  //       else
  //         genero el cobro mensual para month[n]
  //   */
  //
  //   console.log('----------------------------------');
  //   console.log(params);
  //   console.log('----------------------------------');
  // };

  Payment.remoteMethod('createForMonth', {
    description: 'Create payments to collect from students for a ' +
                 'given month and year',
    http: {
      path: '/createForMonth',
      verb: 'post',
      status: 201,
    },
    accepts: [
      {
        arg: 'data',
        description: 'receives month and year as integers {"month":1,"year":2018}',
        http: { source: 'body' },
        type: 'object',
      },
    ],
    returns: {
      arg: 'result',
      type: 'array',
    },
  });

  // Payment.remoteMethod('createMultipleForStudent', {
  //   description: 'Create payments for a whole year for a student',
  //   http: {
  //     path: '/createMultipleForStudent',
  //     verb: 'post',
  //     status: 201,
  //   },
  //   accepts: [
  //     { arg: 'data', type: 'object', 'http': { source: 'body' } },
  //   ],
  //   returns: {
  //     arg: 'result',
  //     type: 'string',
  //   },
  // });
};
