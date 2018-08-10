'use strict';

const throwError = (err, message) => {
  console.log(`BE ${message} - ${err}`);

  console.log(err);
  throw (message);
};

const buildResponse = (message, status = 200) => {
  // console.log(`BR ${status} - `, message);
  return { status: status, result: message };
};

module.exports = {
  throwError,
  buildResponse,
};
