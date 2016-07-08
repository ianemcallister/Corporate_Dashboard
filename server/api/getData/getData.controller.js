/**
 * Using Rails-like standard naming convention for endpoints.
 *             not using this right now - GET     /api/getData              ->  index
 * POST    /api/getData              ->  create
 *             not using this right now - GET     /api/getData/:id          ->  show
 *             not using this right now - PUT     /api/getData/:id          ->  update
 *             not using this right now - DELETE  /api/getData/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import bodyParser from 'body-parser';
import GetData from './getData.model';
//import MarketReceiptService from '../../components/marketReceiptService/marketReceipt.service'
var MarketReceiptService = require('../../components/marketReceiptService/marketReceipt.service');


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of GetDatas
/*export function index(req, res) {
  return GetData.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}*/

// Gets a single GetData from the DB
/*export function show(req, res) {
  return GetData.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}*/

// Fetches and returns pertinant data
export function marketReceipt(req, res) {
  //return new Promise(function(resolve, reject) { resolve('testing'); });
  return MarketReceiptService.provideAll(req.body);
  /*return MarketReceiptService.provideAll(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));*/
}

// Updates an existing GetData in the DB
/*export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return GetData.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}*/

// Deletes a GetData from the DB
/*export function destroy(req, res) {
  return GetData.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}*/
