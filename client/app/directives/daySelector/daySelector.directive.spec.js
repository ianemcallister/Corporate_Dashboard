'use strict';

describe('Directive: daySelector', function () {

  // load the directive's module and view
  beforeEach(module('ahNutsApp'));
  beforeEach(module('app/directives/daySelector/daySelector.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<day-selector></day-selector>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the daySelector directive');
  }));
});
