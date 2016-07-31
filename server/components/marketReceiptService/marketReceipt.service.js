
//var FirebaseConnect = require('../firebaseConnect/firebaseConnect');
//var SquareConnect = require('../squareConnect/squareConnect');

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

function _extractKey(thisObject) {
	var returnKey;

	Object.keys(thisObject).forEach(key => {
		returnKey = key;
	});

	return returnKey;
}

function _extractMarketId(receipt) {
	var key = _extractKey(receipt);
	//event
	//|--->location
	//		|->id

	return receipt[key].event.location.id;
}

function _extractMarketParams(receipt) {
	var key = _extractKey(receipt);
	//event
	//|--->schedule
	//		|->date

	var timezone = "08:00";
	var dayStart = "00:00:00";
	var dayEnd = "23:59:59"
	var parameters = {
		start: {
			date: receipt[key].event.schedule.date,
			time: (dayStart + "-" + timezone)
		},
		end: {
			date: receipt[key].event.schedule.date,
			time: (dayEnd + "-" + timezone)
		}
	};

	return parameters
}

function _becomesDueToFormatedDateTime(becomesDue) {

	//extract the parts and return
	return { 
		date: _formatDate(new Date(becomesDue.year, (becomesDue.month - 1), becomesDue.day)), 
		time: becomesDue.time 
	};
}

function _isDue(becomesDue) {
	var currentDateTime = _currentDateTime();
	var formatedDueDate = _becomesDueToFormatedDateTime(becomesDue);
	var dateHasPassed = parseInt(formatedDueDate.date) < parseInt(currentDateTime.date);
	var dateIsSame = (parseInt(formatedDueDate.date) == parseInt(currentDateTime.date));
	var timeHasPassed = parseInt(formatedDueDate.time) <= parseInt(currentDateTime.time);

	var evaluation = dateHasPassed || (dateIsSame && timeHasPassed);
	
	console.log('_isDue?', parseInt(formatedDueDate.date), parseInt(formatedDueDate.time), parseInt(currentDateTime.date), parseInt(currentDateTime.time), evaluation);

	return evaluation;
}

function _isPastDue(becomesDue) {
	var currentDateTime = _currentDateTime();
	var formatedDueDate = _becomesDueToFormatedDateTime(becomesDue);

	console.log('_isPastDue?', parseInt(formatedDueDate.date), parseInt(currentDateTime.date), (parseInt(formatedDueDate.date) < parseInt(currentDateTime.date)));

	//only need to check the date
	return (parseInt(formatedDueDate.date) < parseInt(currentDateTime.date)); 
}

function _isASquareResponse(responseObject) {

	//make sure it's an object
	if(typeof responseObject == 'object') {

		//make sure it's a square object
		if(typeof responseObject.transactions !== 'undefined' || typeof responseObject.refunds !== 'undefined') return true;
		else return false;

	} else return false;

}

function _buildScheduledToDueMoves(scheduledEvents) {
	//Determin if events need market receipts yet
	var returnArray = [];

	//make sure there are objects in the object to check
	if(_numInObject(scheduledEvents) > 0) {

		//check each scheduled event
		Object.keys(scheduledEvents).forEach(key => {
			var eventObject = {};
			var dueDate = scheduledEvents[key].becomesDue;
			
			//has the due date arrived?
			if(_isDue(dueDate)) {
				
				//is the receipt past due?
				if(_isPastDue(dueDate)) {

					//if so do nothing (_buildScheduledToPastDueMoves will handle)

				} else {
					
					//but if it is not past due, add it to the array
					eventObject[key] = scheduledEvents[key];
					returnArray.push(eventObject);

				}

			} //otherwise do nothing
			
		});

	}

	return returnArray;
}

function _buildScheduledToPastDueMoves(scheduledEvents) {
	//Determin if events need market receipts yet
	var returnArray = [];

	//make sure there are objects in the object to check
	if(_numInObject(scheduledEvents) > 0) {
		
		//check each scheduled event
		Object.keys(scheduledEvents).forEach(key => {
			var eventObject = {};
			var dueDate = scheduledEvents[key].becomesDue;
			
			//has the due date arrived?
			if(_isDue(dueDate)) {
				
				//is the receipt past due?
				if(_isPastDue(dueDate)) {
					
					//but if it is past due, add it to the array
					eventObject[key] = scheduledEvents[key];
					returnArray.push(eventObject);

				} else {
					
					//otherwise do nothing

				}

			} //otherwise do nothing
			
		});
		
	}

	return returnArray;
}

function _buildDueToPastDueMoves(currentAndPast) {
	var returnArray = [];

	if(typeof currentAndPast.due !== 'undefined') {
		
		//make sure there are objects in the object to check
		if(_numInObject(currentAndPast.due) > 0) {

			//check each of the previously due receipts, are they past due now?
			Object.keys(currentAndPast.due).forEach(key => {
				var eventObject = {};
				var dueDate = currentAndPast.due[key].becomesDue;

				//is the receipt past due?
				if(_isPastDue(dueDate)) {

					//but if it is past due, add it to the array
					eventObject[key] = currentAndPast.due[key];
					returnArray.push(eventObject);

				} 

			});
		
		}

	}

	return returnArray;
}

function _applyScheduleUpdates(outgoing) {
	// transactions that must occure on the schedules model
	var workArray = [];

	//loop through all the transactions
	outgoing.forEach(receipt => {

		var path = 'schedule/future/' + _extractKey(receipt);
		
		//add the job to the array
		workArray.push(
			FirebaseConnect.removeRecord(path)
		);

	});

	return workArray;
}

function _applyDueUpdates(incoming, outgoing) {
	// transactions that must occure on the schedules model
	var workArray = [];

	//start with the incoming transactions
	incoming.forEach(receipt => {
		var key = _extractKey(receipt);
		var path = 'forms/market_receipts/due/' + key;

		//add the firebase job to the array
		workArray.push(
			FirebaseConnect.saveRecord(path, receipt[key])
		);

		console.log('marketReceipt from _applyDueUpdates:',receipt);

		var marketId = _extractMarketId(receipt);
		var marketParams = _extractMarketParams(receipt);

		//receipt must be calculated, so add a square job to the array.
		//first get the transaction
		workArray.push(
			SquareConnect.getData('transactions', marketId, marketParams) //type, id, parameters
		);

		//then get the refunds
		workArray.push(
			SquareConnect.getData('refunds', marketId, marketParams) //type, id, parameters
		);

	});

	//then add outgoing transactions
	outgoing.forEach(receipt => {

		var path = 'forms/market_receipts/due/' + _extractKey(receipt);
		
		//add the job to the array
		workArray.push(
			FirebaseConnect.removeRecord(path)
		);

	});

	return workArray;
}

function _applyPastDueUpdates(fromSchedule, fromDue) {
	// transactions that must occure on the schedules model
	var workArray = [];

	//start with the incoming transactions
	fromSchedule.forEach(receipt => {
		var key = _extractKey(receipt);
		var path = 'forms/market_receipts/past_due/' + key;

		//add the firebase job to the array
		workArray.push(
			FirebaseConnect.saveRecord(path, receipt[key])
		);

		console.log('marketReceipt from _applyPastDueUpdates:',receipt);

		var marketId = _extractMarketId(receipt);
		var marketParams = _extractMarketParams(receipt);

		//receipt must be calculated, so add a square job to the array.
		//first get the transaction
		workArray.push(
			SquareConnect.getData('transactions', marketId, marketParams) //type, id, parameters
		);

		//then get the refunds
		workArray.push(
			SquareConnect.getData('refunds', marketId, marketParams) //type, id, parameters
		);

	});

	//then add outgoing transactions
	fromDue.forEach(receipt => {
		var key = _extractKey(receipt);
		var path = 'forms/market_receipts/past_due/' + key;
		
		//add the job to the array
		workArray.push(
			FirebaseConnect.saveRecord(path, receipt[key])
		);

	});

	return workArray;
}

function _combineArrays(arraysArray) {
	var masterArray = [];

	//access the first layer
	arraysArray.forEach(workArrays => {

		//access the second layer
		workArrays.forEach(job => {

			//build the promise array
			masterArray.push(job);

		});

	});

	return masterArray;
}

function _getCurrentAndPastDue(location, employee) {

	//start async work
	return new Promise((resolve, reject) => {

		//get due and past due forms from firebase
		FirebaseConnect.getRecords('forms/market_receipts').then(records => {

			//pass the records back
			resolve(records);

		}).catch(e => {
			console.log("Error:", e);
			reject(e);
		});

	});

}

function _getFutureDue(location, employee) {

	//start async work
	return new Promise((resolve, reject) => {

		FirebaseConnect.getRecords('schedule/future').then(records => {

			//pass the records back
			resolve(records);

		}).catch(e => {
			console.log("Error:", e);
			reject(e);
		});

	});

}

function _updateLocalModel(currentAndPast, future, scheduledToDueList, scheduledToPastDueList, dueToPastDueList) {

	//execute scheduledToDueList moves
	//execute scheduledToPastDueList moves
	//execute dueToPastDueList moves

	//return all the changes
	return currentAndPast;
}

function _calculateTransactionAmount(allTenders) {
	var totalSum = 0;

	allTenders.forEach(tenderObject => {

		totalSum += tenderObject.amount_money.amount;

	});

	return totalSum;
}

function _sumAllValues(valuesArray) {
	var totalSum = 0;

	valuesArray.forEach(value => {
		totalSum += value;
	});

	return totalSum;
}

function _sumAllSquareRecords(newReceiptValues) {
	//define local variable
	var locationsHash = {};

	//loop through all the collections
	newReceiptValues.forEach(squareObject => {

		//then loop through all the transactions
		if(typeof squareObject.transactions !== 'undefined') {
			squareObject.transactions.forEach(transaction => {

				//compile list of locations
				var transactionLocation = transaction.location_id;
				var transactionAmount = _calculateTransactionAmount(transaction.tenders);

				if(typeof locationsHash[transactionLocation] == 'undefined') {
					locationsHash[transactionLocation] = {
						sales: [],
						refunds: []
					};				
				} else locationsHash[transactionLocation].sales.push(transactionAmount);

				//notify the user of the findings
				console.log(transaction);

				//
				
			});

		}

		//or loop through all the refunds
		if(typeof squareObject.refunds !== 'undefined') {
			squareObject.refunds.forEach(transaction => {

				//compile list of locations
				var transactionLocation = transaction.location_id;
				var transactionAmount = _calculateTransactionAmount(transaction.tenders);

				if(typeof locationsHash[transactionLocation] == 'undefined') {
					locationsHash[transactionLocation] = {
						sales: [],
						refunds: []
					};				
				} else locationsHash[transactionLocation].refunds.push(transactionAmount);

				//notify the user of the findings
				console.log(transaction);

				//
				
			});

		}

	});

	//sum up the arrays
	Object.keys(locationsHash).forEach(key => {
		locationsHash[key].sales = _sumAllValues(locationsHash[key].sales);
		locationsHash[key].refunds = _sumAllValues(locationsHash[key].refunds);
	});

	return locationsHash;
}

//function _extractMarketName() {}
function _extractEmployeeName() {
	return {
		name: "Kevin Luna",
		details: "Scheduled to work"
	}
}

function _calculateNetSales() {}
function _calculateRent() {}
function _calculatePay() {}
function _collectExpenses() {}
function _extractStartingBank() {}
function _calculateNetProfits() {}

function _buildNewReceipts(newReceiptValues, possibleMarkets) {
	//define the return value
	var allNewReceipts = [];

	//distill all the square records
	var distilledByLocation = _sumAllSquareRecords(newReceiptValues);

	//loop through by location
	Object.keys(distilledByLocation).forEach(location => {

		var newLocation = {} 
		var eventId;

		//identify the eventId, and add the default values
		possibleMarkets.forEach(option => {
			var key = _extractKey(option);
			if(option[key].event.location.id == location) {
				eventId = key;
				newLocation[eventId] = {
					becomesDue: option[key].becomesDue,
					event: option[key].event
				};
			}
		});

		//then build the suggestion values
		newLocation[eventId].suggestions = {
			marketName: newLocation[eventId].event.location.name,	//extract market name
			scheduledEmployee: _extractEmployeeName(newLocation[eventId]),	//extract scheduled employee name
			marketNet: _calculateNetSales(),			//calculate gross
			marketRent: _calculateRent(),				//calcuate rent
			employeePay: _calculatePay(),				//calculate employee pay
			reimbursableExpenses: _collectExpenses(),	//collect expenses
			startingBank: _extractStartingBank(),		//extract starting bank
			netProfits: _calculateNetProfits()			//calculate total due to Ah-Nuts
		};

		//add the object to the list of items to be returned
		allNewReceipts.push(newLocation)
	});

	return allNewReceipts;
}

function _combineLists(currentAndPast, future) {

	//notify user
	console.log('_combineLists.', currentAndPast, future);

	//identify changes to bring lists up to date
	var scheduledToDueList = _buildScheduledToDueMoves(future);
	var scheduledToPastDueList = _buildScheduledToPastDueMoves(future);
	var dueToPastDueList = _buildDueToPastDueMoves(currentAndPast);

	//notify the user
	console.log('scheduledToDueList', scheduledToDueList);
	console.log('scheduledToPastDueList', scheduledToPastDueList);
	console.log('dueToPastDueList', dueToPastDueList);

	//build async work
	var scheduledUpdates = _applyScheduleUpdates(scheduledToDueList);
	var dueUpdates = _applyDueUpdates(scheduledToDueList, dueToPastDueList);
	var pastDueUpdates = _applyPastDueUpdates(scheduledToPastDueList, dueToPastDueList);

	//combine async work into single array with a parrallel array of keys
	var allWork = _combineArrays([scheduledUpdates, dueUpdates, pastDueUpdates]);

	//execute changes on local model
	currentAndPast = _updateLocalModel(currentAndPast, future, scheduledToDueList, scheduledToPastDueList, dueToPastDueList);

	//start async work 
	return new Promise((resolve, reject) => {

		//perform all work
		Promise.all(allWork).then(response => {

			//all updates to the model have been made and new values have been
			//retreived from square, now we need to..
			var newReceiptValues = [];

			//extract the square results from all the responses
			response.forEach(responseObject => {

				//if it is a square object, add the results to the array
				if(_isASquareResponse(responseObject)) newReceiptValues.push(responseObject);

			});

			//consolidate arrays of possible markets
			var possibleMarkets = _combineArrays([scheduledToDueList, scheduledToPastDueList]);

			//build the required new receipts from the new square models 
			var newReceipts = _buildNewReceipts(newReceiptValues, scheduledToPastDueList);

			//pass the new receipts along
			return newReceipts;

		}).then(newReceipts => {

			//execute the last model updates
			console.log('newReceipts', newReceipts);

			//return the final object
			resolve(currentAndPast);

		}).catch(e => {
			console.log('error:', e);
			reject(e);
		});

	});

}

export function provideAll(specifics) {

	//notifying user
	console.log('provideAll. Specific:', specifics);

	//steps
	return new Promise((resolve, reject) => {

		//1. get all the currnetly due & past due receipts
		var currentlyDueAndPastDue = _getCurrentAndPastDue(specifics.location, specifics.employee);

		//2. get all the future due receipts
		var futureDue = _getFutureDue(specifics.location, specifics.employee);

		//3. update lists of due & past due
		Promise.all([currentlyDueAndPastDue, futureDue]).then(responses =>{

			_combineLists(responses[0], responses[1]).then(result => {

				resolve(result);

			}).catch(e => {
				console.log('error:', e);
				reject(e);
			});

		}).catch(e => {
			console.log('error:', e);
			reject(e);
		});
		//4. return the list to the user

	});

}
