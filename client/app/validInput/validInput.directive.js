'use strict';

angular.module('ahNutsApp')
  .directive('validInput', function () {
    return {
      templateUrl: 'app/validInput/validInput.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
