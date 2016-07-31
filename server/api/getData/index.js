'use strict';

var express = require('express');
var controller = require('./getData.controller');
var bodyParser = require('body-parser');

//return the express object
var app = express();

//get the URL encoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//define our body parsers
app.use(jsonParser); // for parsing application/json
app.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

var router = express.Router();

//router.get('/', controller.index);
//router.get('/:id', controller.show);
router.post('/form/market_receipt', controller.marketReceipt);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
