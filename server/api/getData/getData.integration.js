'use strict';

var app = require('../..');
import request from 'supertest';

var newGetData;

describe('GetData API:', function() {

  describe('GET /api/getData', function() {
    var getDatas;

    beforeEach(function(done) {
      request(app)
        .get('/api/getData')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          getDatas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      getDatas.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/getData', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/getData')
        .send({
          name: 'New GetData',
          info: 'This is the brand new getData!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newGetData = res.body;
          done();
        });
    });

    it('should respond with the newly created getData', function() {
      newGetData.name.should.equal('New GetData');
      newGetData.info.should.equal('This is the brand new getData!!!');
    });

  });

  describe('GET /api/getData/:id', function() {
    var getData;

    beforeEach(function(done) {
      request(app)
        .get('/api/getData/' + newGetData._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          getData = res.body;
          done();
        });
    });

    afterEach(function() {
      getData = {};
    });

    it('should respond with the requested getData', function() {
      getData.name.should.equal('New GetData');
      getData.info.should.equal('This is the brand new getData!!!');
    });

  });

  describe('PUT /api/getData/:id', function() {
    var updatedGetData;

    beforeEach(function(done) {
      request(app)
        .put('/api/getData/' + newGetData._id)
        .send({
          name: 'Updated GetData',
          info: 'This is the updated getData!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGetData = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGetData = {};
    });

    it('should respond with the updated getData', function() {
      updatedGetData.name.should.equal('Updated GetData');
      updatedGetData.info.should.equal('This is the updated getData!!!');
    });

  });

  describe('DELETE /api/getData/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/getData/' + newGetData._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when getData does not exist', function(done) {
      request(app)
        .delete('/api/getData/' + newGetData._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
