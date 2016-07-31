'use strict';

//setting up firebase
var firebase = require("firebase");
var environment = process.env.NODE_ENV;

//initialize the connection
firebase.initializeApp({
  serviceAccount: {
    projectId: process.FIREBASE_ID,
    clientEmail: process.FIREBASE_EMAIL,
    privateKey: process.FIREBASE_KEY
  },
  databaseURL: process.FIREBASE_DB
});

//define the root collection
var rootParent = firebase.database().ref();

//log current state
console.log('environment', environment);
console.log('FIREBASE_ID', process.FIREBASE_ID);

//get the list of employees 
//get the list of locations
//get the list of outstanding expense reports for a select employee
//get due market_receipts
//get past_due market_receipts
//get scheduled events

//calculate due market receipts

//save due market receipts
//save past_due market receipts

//delete due mareket receipts
//delete past_due market_receipts

export function getRecords(path) {

	//console.log('getting records');

	return new Promise(function(resolve, reject) {
		//resolve('got it: ' + requirnments.db);

		rootParent.child(path).on("value", function(snapshot) {
			
			//distill the values
			var values = snapshot.val();

			//log them to the user
			//console.log('snapshot values for', path, values);

			//pass them back
			resolve(values);

		}, function(error) {
			console.log("error",error);
			reject(error);
		});

	});

}

export function removeRecord(path) {

	return new Promise((resolve, reject) => {
		resolve('removed: ' + path);
	});

}

export function saveRecord(path, data) {

	return new Promise((resolve, reject) => {
		resolve('saved: ' + path);
	});

}

export function moveRecords(record, origin, target) {
	
	//notifying the user
	console.log('moving records', record, origin, target);

	return new Promise(function(resolve, reject) {
		resolve('moved the object');
	});

}
