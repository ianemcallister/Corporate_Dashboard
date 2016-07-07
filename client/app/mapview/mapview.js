'use strict';

angular.module('ahNutsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mapview', {
        url: '/mapview',
        template: '<mapview></mapview>'
      });
  });
