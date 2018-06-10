'use strict';

module.exports = function(Student) {
  Student.disableRemoteMethodByName('deleteById');
};
