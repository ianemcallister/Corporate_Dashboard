
var environmentalVariables = require('./config/local.env');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.FIREBASE_ID = environmentalVariables.FIREBASE_ID;
process.FIREBASE_EMAIL = environmentalVariables.FIREBASE_EMAIL;
process.FIREBASE_KEY = environmentalVariables.FIREBASE_KEY;
process.FIREBASE_DB = environmentalVariables.FIREBASE_DB;

var endpoint = require('./api/getData/getData.controller');
var MarketReceiptService = require('./components/marketReceiptService/marketReceipt.service');

console.log('testing cli');

/*endpoint.marketReceipt({"body":"testing"}).then(function(response) {
	console.log("got this from getDataController:", response);
});*/

MarketReceiptService.provideAll().then(function(response) {
	console.log('from MarketReceiptService:', response);
});
