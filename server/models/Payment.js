'use strict';

const PaymentService = require('../services/PaymentService');
const responseHelper = require('../utils/responseHelper');

module.exports = function(Payment) {
  Payment.disableRemoteMethodByName('deleteById');

  Payment.createForMonth = async (params) => {
    const month = params.month;
    const year = params.year;
    let Student = Payment.app.models.Student;

    const monthPayments = await Payment.find({ where: { month, year } }).catch(err => {
      return responseHelper.buildError(`error finding payments: ${err}`, 500);
    });
    const students = await Student.find().catch(err => {
      return responseHelper.buildError(`error finding students: ${err}`, 500);
    });

    const allPayments = PaymentService.getAllMonthlyPayments(students,
      monthPayments, month, year);

    const res = await Payment.create(allPayments).catch(err => {
      return responseHelper.buildError(`error inserting payments: ${err}`, 500);
    });
    return responseHelper.buildResponse(res, 201);
  };

  Payment.createMultipleForStudent = async (params) => {
    const date = params.date; //fecha q realiza el pago
    const months = params.months; //cuantos meses esta pagando a la vez
    const student = params.student;

    /*
      busco el estudiante
      busco el valor del plan del estudiante
      genero el cobro parcial a partir de date (para month[0])
      months-1 veces n=>
        busco en pagos por mes/año/estudiante
          si esta => return
        else
          genero el cobro mensual para month[n]
    */

    console.log('----------------------------------');
    console.log(params);
    console.log('----------------------------------');
  };

  Payment.remoteMethod('createForMonth', {
    description: 'Create payments to collect from students for a ' +
                 'given month and year',
    http: {
      path: '/createForMonth',
      verb: 'post',
      status: 201,
    },
    accepts: [
      { arg: 'data', type: 'object', 'http': { source: 'body' } },
    ],
    returns: {
      arg: 'result',
      type: 'string',
    },
  });

  Payment.remoteMethod('createMultipleForStudent', {
    description: 'Create payments for a whole year for a student',
    http: {
      path: '/createMultipleForStudent',
      verb: 'post',
      status: 201,
    },
    accepts: [
      { arg: 'data', type: 'object', 'http': { source: 'body' } },
    ],
    returns: {
      arg: 'result',
      type: 'string',
    },
  });
};
