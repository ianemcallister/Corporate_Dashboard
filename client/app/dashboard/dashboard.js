'use strict';

angular.module('ahNutsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/:id/dashboard',
        template: '<dashboard></dashboard>'
      });
  });
