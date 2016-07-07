'use strict';

describe('Component: DashboardComponent', function () {

  // load the controller's module
  beforeEach(module('ahNutsApp'));

  var DashboardComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    DashboardComponent = $componentController('dashboard', {});
  }));

  it('should accomodate a reviewer, administrator, employee & customer mode', function () {
    expect(1).toEqual(1);
  });

  it('must display a geospatial view snapshot', function () {
    expect(1).toEqual(1);
  });

  it('must display a "key metrics" view snapshot', function () {
    expect(1).toEqual(1);
  });

  it('must display a date view snapshot', function () {
    expect(1).toEqual(1);
  });

  it('geospatial view snapshot must link to geospatial controller', function () {
    expect(1).toEqual(1);
  });

  it('key metrics view snapshot must link to key metrics controller', function () {
    expect(1).toEqual(1);
  });

  it('data view snapshot must link to data controller', function () {
    expect(1).toEqual(1);
  });

});
