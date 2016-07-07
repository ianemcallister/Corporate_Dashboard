'use strict';

describe('Directive: validInput', function () {

  // load the directive's module and view
  beforeEach(module('ahNutsApp'));
  beforeEach(module('app/validInput/validInput.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<valid-input></valid-input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the validInput directive\n');
  }));
});
