'use strict';

module.exports = function(Plan) {
  Plan.disableRemoteMethodByName('deleteById');
};
