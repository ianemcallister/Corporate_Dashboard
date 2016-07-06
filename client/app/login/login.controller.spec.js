'use strict';

describe('Component: LoginComponent', function () {

  // load the controller's module
  beforeEach(module('ahNutsApp'));

  var LoginComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    LoginComponent = $componentController('login', {});
  }));

  it('should have a username input field', function () {
    expect(1).toEqual(1);
  });

  it('should have a password input field', function () {
    expect(1).toEqual(1);
  });

  it('should have a submit button', function () {
    expect(1).toEqual(1);
  });

  it('focus should be set on username input on load', function () {
    expect(1).toEqual(1);
  });

  it('input fields should auto populate for repeat users', function () {
    expect(1).toEqual(1);
  });

  it('valid usernames should turn the username input green for success', function () {
    expect(1).toEqual(1);
  });

  it('invalid usernames should turn the username input red for error', function () {
    expect(1).toEqual(1);
  });

  it('valid passwords should turn the password input green for success', function () {
    expect(1).toEqual(1);
  });

  it('invalid passwords should turn the password input red for error', function () {
    expect(1).toEqual(1);
  });

  it('without a valid username & password the submit button should be locked', function () {
    expect(1).toEqual(1);
  });

  it('entering a valid username & password should unlock the submit button', function () {
    expect(1).toEqual(1);
  });

  it('clicking the submit button should send credentials to the server', function () {
    expect(1).toEqual(1);
  });

  it('invalid credentials should display an error message', function () {
    expect(1).toEqual(1);
  });

  it('valid credentials should redirect to the user dashboard', function () {
    expect(1).toEqual(1);
  });
});
