'use strict';

angular.module('ahNutsApp')
  .directive('daySelector', function () {

    //controller
    function daySelectorController() {
    	var vm = this;

    	//track the state of each button
    	vm.btnStates = {
    		allBtn: {
    			state: {
    				text: 'All',
    				textOptions: {
    					default: 'All',
    					alt: 'Clr'
    				},
    				clicked: false
    			}
    		},
    		sun: {
    			state: {
    				text: 'SUN',
    				clicked: false
    			},
    			classes: {
    				'btn-default': true,
    				'btn-primary':false
    			}
    		},
    		mon: {
    			state: {
    				text: 'MON',
    				clicked: false
    			},
    			classes: {
    				'btn-default': true,
    				'btn-primary':false
    			}
    		},
    		tue: {
    			state: {
    				text: 'TUE',
    				clicked: false
    			},
    			classes: {
    				'btn-default': true,
    				'btn-primary':false
    			}
    		},
    		wed: {
    			state: {
    				text: 'WED',
    				clicked: false
    			},
    			classes: {
    				'btn-default': true,
    				'btn-primary':false
    			}
    		},
    		thu: {
    			state: {
    				text: 'THU',
    				clicked: false
    			},
    			classes: {
    				'btn-default': true,
    				'btn-primary':false
    			}
    		},
    		fri: {
    			state: {
    				text: 'FRI',
    				clicked: false
    			},
    			classes: {
    				'btn-default': true,
    				'btn-primary':false
    			}
    		},
    		sat: {
    			state: {
    				text: 'SAT',
    				clicked: false
    			},
    			classes: {
    				'btn-default': true,
    				'btn-primary':false
    			}
    		},
    	}

    	//vm methods
    	vm.toggleBtn = function(id) {

    		//flip the sign
    		vm.btnStates[id].state.clicked = !vm.btnStates[id].state.clicked;

    		//update the classes
    		vm.btnStates[id].classes['btn-default'] = !vm.btnStates[id].classes['btn-default'];
    		vm.btnStates[id].classes['btn-primary'] = !vm.btnStates[id].classes['btn-primary'];
    		
    	};

    	vm.toggleAll = function() {
    		let allbtns = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    		//flip the sign
    		vm.btnStates['allBtn'].state.clicked = !vm.btnStates['allBtn'].state.clicked;

    		//change the text
    		if(vm.btnStates['allBtn'].state.clicked) vm.btnStates['allBtn'].state.text = vm.btnStates['allBtn'].state.textOptions.alt;
    		else vm.btnStates['allBtn'].state.text = vm.btnStates['allBtn'].state.textOptions.default;

    		//toggle each btn
    		allbtns.forEach(function(id) {
	    		//flip the sign
	    		vm.btnStates[id].state.clicked = vm.btnStates['allBtn'].state.clicked;

	    		//update the classes
	    		vm.btnStates[id].classes['btn-default'] = vm.btnStates['allBtn'].state.clicked;
	    		vm.btnStates[id].classes['btn-primary'] = vm.btnStates['allBtn'].state.clicked;
    		});

    	};

    }

    return {
      templateUrl: 'app/directives/daySelector/daySelector.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      },
      controller: daySelectorController,
      controllerAs: 'vm'
    };
  });
