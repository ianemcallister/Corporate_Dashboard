'use strict';

describe('Service: authentication', function () {

  // load the service's module
  beforeEach(module('ahNutsApp'));

  // instantiate service
  var authentication;
  beforeEach(inject(function (_authentication_) {
    authentication = _authentication_;
  }));

  it('should be a singleton service', function () {
    expect(!!authentication).toBe(true);
  });

  it('should accept a credentials object', function () {
    expect(1).toEqual(1);
  });

  it('should pass a credentials object to Firebase', function () {
    expect(1).toEqual(1);
  });

  it('should receive a JWT from Firebase', function () {
    expect(1).toEqual(1);
  });

  it('should save a JWT', function () {
    expect(1).toEqual(1);
  });

  it('should return an authentication state', function () {
    expect(1).toEqual(1);
  });

});
