'use strict';

module.exports = function(MethodOfPayment) {
  MethodOfPayment.disableRemoteMethodByName('deleteById');
};
