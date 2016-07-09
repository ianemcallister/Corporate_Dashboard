
var FirebaseConnect = require('../firebaseConnect/firebaseConnect');

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

function _isDue(becomesDue) {
	var currentDateTime = _currentDateTime();

	return true;
}

function _isPastDue(becomesDue) {
	var currentDateTime = _currentDateTime();

	return true;
}

function _buildScheduledToDueMoves(scheduledEvents) {
	//Determin if events need market receipts yet
	var returnArray = [];

	//check each scheduled event
	Object.keys(scheduledEvents).forEach(key => {
		var dueDate = scheduledEvents[key].becomesDue;
		
		//has the due date arrived?
		if(_isDue(dueDate)) {
			
			//is the receipt past due?
			if(_isPastDue(dueDate)) {

				//if so do nothing (_buildScheduledToPastDueMoves will handle)

			} else {

				//but if it is not past due, add it to the array
				returnArray.push(scheduledEvents[key]);

			}

		} //otherwise do nothing
		
	});

	return returnArray;
}

function _buildScheduledToPastDueMoves(scheduledEvents) {
	return [];
}

function _buildDueToPastDueMoves(currentAndPast, scheduledToDueList) {
	return [];
}

function _applyScheduleUpdates(outgoing) {
	return 1;
}

function _applyDueUpdates(incoming, outgoing) {
	return 2;
}

function _applyPastDueUpdates(fromSchedule, fromDue) {
	return 3;
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

		//perform all work
		Promise.all([scheduledUpdates, dueUpdates, pastDueUpdates]).then(response => {

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
