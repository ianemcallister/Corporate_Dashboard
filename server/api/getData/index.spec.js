'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var getDataCtrlStub = {
  index: 'getDataCtrl.index',
  show: 'getDataCtrl.show',
  create: 'getDataCtrl.create',
  update: 'getDataCtrl.update',
  destroy: 'getDataCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var getDataIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './getData.controller': getDataCtrlStub
});

describe('GetData API Router:', function() {

  it('should return an express router instance', function() {
    getDataIndex.should.equal(routerStub);
  });

  describe('GET /api/getData', function() {

    it('should route to getData.controller.index', function() {
      routerStub.get
        .withArgs('/', 'getDataCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/getData/:id', function() {

    it('should route to getData.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'getDataCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/getData', function() {

    it('should route to getData.controller.create', function() {
      routerStub.post
        .withArgs('/', 'getDataCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/getData/:id', function() {

    it('should route to getData.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'getDataCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/getData/:id', function() {

    it('should route to getData.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'getDataCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/getData/:id', function() {

    it('should route to getData.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'getDataCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
