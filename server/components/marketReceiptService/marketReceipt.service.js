
var FirebaseConnect = require('../firebaseConnect/firebaseConnect');

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

	console.log('_isDue?', parseInt(formatedDueDate.date), parseInt(formatedDueDate.time), parseInt(currentDateTime.date), parseInt(currentDateTime.time), (parseInt(formatedDueDate.date) <= parseInt(currentDateTime.date) && parseInt(formatedDueDate.time) <= parseInt(currentDateTime.time)));

	return (parseInt(formatedDueDate.date) <= parseInt(currentDateTime.date) && parseInt(formatedDueDate.time) <= parseInt(currentDateTime.time));
}

function _isPastDue(becomesDue) {
	var currentDateTime = _currentDateTime();
	var formatedDueDate = _becomesDueToFormatedDateTime(becomesDue);

	console.log('_isPastDue?', parseInt(formatedDueDate.date), parseInt(currentDateTime.date), (parseInt(formatedDueDate.date) < parseInt(currentDateTime.date)));

	//only need to check the date
	return (parseInt(formatedDueDate.date) < parseInt(currentDateTime.date)); 
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
		
		//add the job to the array
		workArray.push(
			FirebaseConnect.saveRecord(path, receipt[key])
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
		
		//add the job to the array
		workArray.push(
			FirebaseConnect.saveRecord(path, receipt[key])
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

		workArrays.forEach(job => {

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

function _combineLists(currentAndPast, future) {

	//notify user
	console.log('_combineLists.');

	//identify changes to bring lists up to date
	var scheduledToDueList = _buildScheduledToDueMoves(future);
	var scheduledToPastDueList = _buildScheduledToPastDueMoves(future);
	var dueToPastDueList = _buildDueToPastDueMoves(currentAndPast);

	console.log('scheduledToDueList', scheduledToDueList);
	console.log('scheduledToPastDueList', scheduledToPastDueList);
	console.log('dueToPastDueList', dueToPastDueList);

	//start async work 
	return new Promise((resolve, reject) => {

		var scheduledUpdates = _applyScheduleUpdates(scheduledToDueList);
		var dueUpdates = _applyDueUpdates(scheduledToDueList, dueToPastDueList);
		var pastDueUpdates = _applyPastDueUpdates(scheduledToPastDueList, dueToPastDueList);

		var allWork = _combineArrays([scheduledUpdates, dueUpdates, pastDueUpdates]);

		//perform all work
		Promise.all(allWork).then(response => {

			console.log(response);

			//update the due model
			currentAndPast['due'] = response[1];

			//update the past_due model
			currentAndPast['past_due'] = response[2];

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
