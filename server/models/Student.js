'use strict';

const responseHelper = require('../utils/responseHelper');

module.exports = function(Student) {
  Student.disableRemoteMethodByName('deleteById');

  const updateActiveStatus = async (ids, newValue) => {
    let whereFilter = { id: { inq: ids } };
    const res = await Student.updateAll(whereFilter, { isActive: newValue })
      .catch(err => {
        return responseHelper.buildError(`error updating isActive=${newValue} students: ${err}`,
          500);
      });
    return responseHelper.buildResponse(res, 200);
  };

  Student.deactivate = async (params) => {
    return updateActiveStatus(params, false);
  };

  Student.activate = async (params) => {
    return updateActiveStatus(params, true);
  };

  Student.remoteMethod('deactivate', {
    description: 'Deactivate one or more students',
    http: {
      path: '/deactivate',
      verb: 'post',
      status: 200,
    },
    accepts: [
      { arg: 'data', type: 'array', 'http': { source: 'body' } },
    ],
    returns: {
      arg: 'result',
      type: 'string',
    },
  });

  Student.remoteMethod('activate', {
    description: 'Activate one or more students',
    http: {
      path: '/activate',
      verb: 'post',
      status: 200,
    },
    accepts: [
      { arg: 'data', type: 'array', 'http': { source: 'body' } },
    ],
    returns: {
      arg: 'result',
      type: 'string',
    },
  });
};
