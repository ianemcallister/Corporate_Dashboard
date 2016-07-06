'use strict';

(function(){

class LoginComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('ahNutsApp')
  .component('login', {
    templateUrl: 'app/login/login.html',
    controller: LoginComponent//,		//TODO: add this back later if need be
    //controllerAs: Login
  });

})();
