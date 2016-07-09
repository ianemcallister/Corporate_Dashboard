
var FirebaseConnect = require('../firebaseConnect/firebaseConnect');

function _getCurrentAndPastDue(location, employee) {

	return new Promise((resolve, reject) => {

		//TODO: REMOVE THIS LATER
		resolve('_getCurrentAndPastDue testing');
	});
}

function _getFutureDue(location, employee) {

	//start async work
	return new Promise((resolve, reject) => {

		//TODO: REMOVE THIS LATER
		resolve('_getFutureDue testing');
	});

}

function _combineLists(currentAndPast, future) {

	//notify user
	console.log('_combineLists. variables:', currentAndPast, future);

	//start async work
	return new Promise((resolve, reject) => {

		//TODO: REMOVE THIS LATER
		resolve('testing from _combineLists');
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

		});
		//4. return the list to the user

	});

}
