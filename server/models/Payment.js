'use strict';

module.exports = function(Payment) {
  Payment.disableRemoteMethodByName('deleteById');

  Payment.createForMonth = async (params) => {
    const month = params.month;
    const year = params.year;
    let monthYear = `${month} ${year}`;

    /*
    para cada estudiante activo con fecha de enrollment
      busco en pagos por mes/año/estudiante
      si esta => return
      else
        busco el valor del plan del estudiante
        busco fecha enrollment del estudiante
        si la fecha de enrollment es este mes
          genero el cobro parcial
        else
          genero el cobro mensual
    */

    console.log('----------------------------------');
    console.log(params);
    console.log('----------------------------------');
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
