'use strict';

angular.module('ahNutsApp')
  .directive('validInput', function () {
    
  	function validInputController() {
  		var vm = this;
  		
  		//view variables
  		vm.hasTitle;
  		vm.hasError;
  		vm.inputDivClasses = {
  			"input-group":true,
  			"form-group":true, 
  			"has-success":false,
  			"has-danger":false
  		};
  		vm.inputClasses = {
  			"form-control":true,
  			"form-control-success":false,
  			"form-control-danger":false
  		};

  		//test for title
  		if(typeof vm.controls.title == 'undefined') vm.hasTitle = true;
  		else vm.hasTitle = false;

  		//test for error
  		if(typeof vm.error == 'object') vm.hasError = true;
  		else vm.hasError = false;

  	}

    return {
      restrict: 'AECM',
      scope: {
      	controls: '=',
      	error: '=',
      	credential: '='
      },
      templateUrl: 'app/validInput/validInput.html',
      controller: validInputController,
      controllerAs: 'vm',
      bindToController: true,
      link: function (scope, element, attrs) {
      	
      	//watch the value
      	scope.$watch('vm.inputValue', function(newValue, oldValue) {
      		
      		if(typeof newValue !== 'undefined') {
	      		if(newValue.length > 3) {
	      			//set the visual indicators
	      			_validateInput(scope.vm);
	      			//save the value

	      		}
	      		else _invalidateInput(scope.vm);      			
      		}

      	});

      }
    };

  });

function _validateInput(ref) {
	//override old values
	ref.inputDivClasses['has-danger'] = false;
	ref.inputClasses['form-control-danger'] = false;
	//set new value
	ref.inputDivClasses['has-success'] = true;
	ref.inputClasses['form-control-success'] = true;
};

function _invalidateInput(ref) {
	//override old values
	ref.inputDivClasses['has-success'] = false;
	ref.inputClasses['form-control-success'] = false;
	//set new values
	ref.inputDivClasses['has-danger'] = true;
	ref.inputClasses['form-control-danger'] = true;
};
