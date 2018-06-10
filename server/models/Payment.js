'use strict';

module.exports = function(Payment) {
  Payment.disableRemoteMethodByName('deleteById');
};
