
var FirebaseConnect = require('../firebaseConnect/firebaseConnect');

function _isPastDue(dateObject) {
	//check if this due date has passed or not
	return false;
}

function _checkForPastDue(wereDue) {
	//declare return object
	let returnObject = {
		toUpdate: {},
		noChange: {}
	};

	console.log('these were due', wereDue);

	if(typeof wereDue !== 'undefined') {
		
		//check if any of these receipts are now past due
		Object.keys(wereDue).forEach(function(receipt) {

			if(typeof receipt.becomesDue !== 'undefined') {
				
				//check if this receipt is past due
				if(_isPastDue(receipt.becomesDue)) {
					returnObject.toUpdate[receipt] = wereDue[receipt];
				} else {
					returnObject.noChange[receipt] = wereDue[receipt];
				};

			}

		});

		return returnObject;

	} else {

		return [];
		
	}

}

export function provideAll(specifics) {
	//declare local variable
	let activeReceipts;
	let newReceipts;
	let allReceipts;

	return new Promise(function(resolve, reject) {
		//was a location given in the specifics?
		//was an employee given in the specifics?

		//1. get all current due & past due receipts
		FirebaseConnect.getRecords("forms/market_receipts").then(function(response) {
			
			//save the results
			activeReceipts = response;

			console.log('got here');

			//2. check if due need to be changed to past due
			var updates = _checkForPastDue(activeReceipts.due);

			console.log(updates);
			//add the updates to the Firebase model


			//reflect updates in local model


			//3. check for scheduled events that are now due or past due
			FirebaseConnect.getRecords("schedule/future").then(function(response) {
				
				//save the results
				newReceipts = response;

				//check if any of these events are due or past due

				//update the model as need be

				//add the new results to the old ones
				
				//return all the due and past due reports
				resolve(newReceipts);

			}).catch(function(e) {
				reject(e);
			});

		}).catch(function(e) {
			reject(e);
		});
	
	});

}
