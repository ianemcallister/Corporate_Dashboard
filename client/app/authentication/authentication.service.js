'use strict';

function authenticationService() {
	// AngularJS will instantiate a singleton by calling "new" on this function
	var authService = this;

}

authenticationService.prototype.authenticateUser = function(credentials) {
	//accept a credentials object

	return {
		'uid': 'test',
		"provider": "email",
		"token": "odiguaoew",
		"auth": {},
		"expires": 12903891
	}
}

angular.module('ahNutsApp')
  .service('authentication', authenticationService);
