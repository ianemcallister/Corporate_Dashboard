'use strict';

(function(){

class DashboardComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('ahNutsApp')
  .component('dashboard', {
    templateUrl: 'app/dashboard/dashboard.html',
    controller: DashboardComponent//, TODO: MAYBE ADD THIS BACK IN LATER
    //controllerAs: Dashboard
  });

})();
