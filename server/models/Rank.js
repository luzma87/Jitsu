'use strict';

module.exports = function(Rank) {
  Rank.disableRemoteMethodByName('deleteById');
};
