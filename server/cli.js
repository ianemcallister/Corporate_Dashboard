
var endpoint = require('./api/getData/getData.controller');
var MarketReceiptService = require('./components/marketReceiptService/marketReceipt.service');

console.log('testing cli');

endpoint.marketReceipt({"body":"testing"}).then(function(response) {
	console.log("got this from getDataController:", response);
});

MarketReceiptService.provideAll().then(function(response) {
	console.log('from MarketReceiptService:', response);
});
