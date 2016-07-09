
var FirebaseConnect = require('../firebaseConnect/firebaseConnect');

//declare return object
let updatesModel = {
	toUpdate: {
		due:{},
		past_due:{}
	},
	noChange: {
		due: {},
		past_due: {}
	}
};

function _numInObject(anObject) {
	let i = 0;
	Object.keys(anObject).forEach(function(subObject) {
		i++;
	});
	return i;
}

function _formatDate(time) {
	//console.log(time);
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	var day = time.getDate();

	if(month < 10) month = "0" + month;
	if(day < 10) day = "0" + day;

	var formatedDate = year + month + day;

	//console.log(year, month, day, formatedDate);
	return formatedDate;
}

function _twentfyfourTime(time) {
	var hour = time.getHours();
	var mins = time.getMinutes();

	if(hour < 10) hour = "0" + hour;
	if(mins < 10) mins = "0" + mins;

	var formattedTime = hour + "" + mins;
	//console.log(formattedTime);
	return formattedTime;
}

function _currentDateTime() {
	var newTime = new Date();

	return { 
		date: _formatDate(newTime),
		time: _twentfyfourTime(newTime)
	}
}

function _isPastDue(dateObject) {
	//check if this due date has passed or not
	return false;
}

function _addUpdatesToModel(updates, model) {

	//loop through all updates
	Object.keys(updates.toUpdate).forEach(function(key) {

		//add the records to the model
		model.past_due[key] = updates.toUpdate[key];

	});

	//return the values
	return model;
}

function _checkForDue(scheduledEvents) {
	var currentDateTime = _currentDateTime();

	//notify user
	console.log('checking for due:', currentDateTime);

	//check it's beocmesDue date and time against the current time
}

function _checkForPastDue(wereDue) {
	var currentDateTime = _currentDateTime();

	//notify user
	console.log('these were due', currentDateTime, wereDue);
		
	//check if any of these receipts are now past due
	Object.keys(wereDue).forEach(function(receipt) {

		if(typeof receipt.becomesDue !== 'undefined') {
			
			//check if this receipt is past due
			if(_isPastDue(receipt.becomesDue)) {
				returnObject.toUpdate.past_due[receipt] = wereDue[receipt];
			} else {
				returnObject.noChange.due[receipt] = wereDue[receipt];
			};

		}

	});

	return updatesModel;

}

function _buildAMarketReceipt(anEvent) {

	return new Promise((resolve, reject) => {

		//reach out to square for new gross numbers
		
		//questions
		//market name - get this from firebase (no work needed)
		//market net - calculate net from gross - discounts/refunds
			//show calculations
			//gross
			//-discounts
			//-refunds
			//net
		//employee name - get this from the scheduled object (no work needed)
		//market fee - calculate from firebase object and gross
			//show calculations
			//net sales
			//-any percentages
			//-any flat fees
			//total market fee
		//employee pay 
			//show calculations
			//calculate hourly from employee rate and assumed hours
			//calculate commission from net sales * commision rate
			//choose the greater value
		//expense receipts due
			//default to 0, for now employees input this
		//starting bank
			//default to 60 for now
		//due to ah-nuts
			//show calculations
			//net sales
			//-market fees
			//-employee pay
			//-expenses
			//-starting bank
			//due to ah-nuts
			resolve('testing market promise');
	});

}

function _buildMarketReceipts(newEvents) {
	//define local variables
	var newEventPromises;

	//notify the user
	console.log('building new receipts');

	return new Promise(function(resolve, reject) {
		
		//if there is more than one new event we'll have a list of promises
		Object.keys(newEvents).forEach(function(eventId) {

			//notify the user
			console.log(eventId);

			//build a promise for each event

		});

		//run all the promises
		Promise.all(newEventPromises).then(values => {

			//once all the promises have resolved, return them
			resolve(values);
		});

	});
	//return promise for async work

}

export function provideAll(specifics) {
	//declare local variable
	let activeReceipts;
	let newReceipts;
	let allReceipts;
	let updates;

	return new Promise(function(resolve, reject) {
		//was a location given in the specifics?
		//was an employee given in the specifics?

		//1. get all current due & past due receipts
		FirebaseConnect.getRecords("forms/market_receipts").then(function(response) {
			
			//save the results
			activeReceipts = response;

			console.log('got here');

			//2. check if due need to be changed to past due
			if(typeof activeReceipts.due !== 'undefined') {
				
				//save due that need to be changed into updates
				updates = _checkForPastDue(activeReceipts.due);

				//notify the user of the updates
				console.log("updates", updates);

				//if there are updates
				if(_numInObject(updates.toUpdate) > 0) {

					//add the updates to the Firebase model
					Object.keys(updates.toUpdate).forEach(function(update) {

						/*FirebaseConnect.moveRecords(update, "forms/market_receipts/due", "forms/market_receipts/past_due")
						.then(function(response) {

						}).catch(function(error) {
							console.log('error', error);
							reject(error);
						});*/

					});

					//reflect updates in the local model
					activeReceipts = _addUpdatesToModel(updates, activeReceipts);

				}

			}

			//3. check for scheduled events that are now due or past due
			FirebaseConnect.getRecords("schedule/future").then(function(response) {
				
				//save the results
				newReceipts = response;

				//log the results
				console.log('newReceipts:', newReceipts);
				
				//check if any of these events are due or past due
				if(typeof newReceipts == 'object') {
					
					updates = _checkForDue(newReceipts)

					//for those that are due or past due, build the receipts
					_buildMarketReceipts(updates).then((newReceipts) => {

						resolve(allReceipts);

					}).catch((e) => {
						console.log('error', e);
						reject(e);
					});

					//update the model as need be

					//add the new results to the old ones

				} else {

					//return all the due and past due reports
					resolve(allReceipts);

				}

			}).catch(function(e) {
				console.log("error", e);
				reject(e);
			});

		}).catch(function(e) {
			console.log("error", e);
			reject(e);
		});
	
	});

}
