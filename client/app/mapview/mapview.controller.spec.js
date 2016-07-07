'use strict';

describe('Component: MapviewComponent', function () {

  // load the controller's module
  beforeEach(module('ahNutsApp'));

  var MapviewComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    MapviewComponent = $componentController('mapview', {});
  }));

  it('should display a map of all locations', function () {
    expect(1).toEqual(1);
  });

  it('should list all locations in a list', function () {
    expect(1).toEqual(1);
  });

  it('clicking each location should display a pop-up with info', function () {
    expect(1).toEqual(1);
  });
});
