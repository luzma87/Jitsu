'use strict';

module.exports = function(MaritalStatus) {
  MaritalStatus.disableRemoteMethodByName('deleteById');
};
