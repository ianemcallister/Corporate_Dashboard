
var environmentalVariables = require('./config/local.env');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.FIREBASE_ID = environmentalVariables.FIREBASE_ID;
process.FIREBASE_EMAIL = environmentalVariables.FIREBASE_EMAIL;
process.FIREBASE_KEY = environmentalVariables.FIREBASE_KEY;
process.FIREBASE_DB = environmentalVariables.FIREBASE_DB;
process.SQUARE_ACCESS_TOKEN = environmentalVariables.SQUARE_ACCESS_TOKEN;

var endpoint = require('./api/getData/getData.controller');
var MarketReceiptService = require('./components/marketReceiptService/marketReceipt.service');
var SquareConnect = require('./components/squareConnect/squareConnect');
var fs = require('fs');

console.log('testing cli');

/*endpoint.marketReceipt({"body":"testing"}).then(function(response) {
	console.log("got this from getDataController:", response);
});*/

MarketReceiptService.provideAll({location:'bixby', employee:'kevin'}).then(function(response) {
	console.log('from MarketReceiptService:', response);
});

function _calculateTotal(allData) {
	var total = 0;
	
	//first layer
	allData.transactions.forEach(function(transaction) {

		//second layer
		transaction.tenders.forEach(function(charge) {
			var cost = parseFloat(charge.amount_money.amount);
			console.log(charge.amount_money.amount);
			total += cost;

		});

	});

	return total;
}

function _calculateRefunds(allData) {
	var total = 0;

	allData.refunds.forEach(refund => {
		console.log(refund.amount_money.amount);
		total += refund.amount_money.amount
	});

	return total;

}

/*var locationId = 'E5D28QB6EZ8CC';
var parameters = {
	start: {
		date: '2016-06-28',
		time: "00:00:00-08:00"
	},
	end: {
		date: '2016-06-28',
		time: "23:59:59-08:00"
	}
};

SquareConnect.getData('transactions', locationId, parameters).then(response => {

	console.log("Gross: $", (_calculateTotal(response) / 100).toFixed(2));
});

SquareConnect.getData('refunds', locationId, parameters).then(response => {
	
	console.log("Refunds: $", (_calculateRefunds(response) / 100).toFixed(2));
});*/
