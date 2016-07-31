'use strict';

//setting up square Connect
var https = require('https');
var fs = require('fs');
var environment = process.env.NODE_ENV;

function _standardHeader() {
	return {
		'Authorization': 'Bearer ' + process.SQUARE_ACCESS_TOKEN,
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
}

function _parameters(parameters) {

	return  'begin_time=' + parameters.start.date + "T" + parameters.start.time +
			'&end_time=' + parameters.end.date + "T" + parameters.end.time;
}

function _requestOptions(type, id, parameters) {

	var header = _standardHeader();
	var paramString = _parameters(parameters);

	return {
		hostname: 'connect.squareup.com',
		path: '/v2/locations/' + id + '/' + type + '?' + paramString,
		method: 'GET',
		headers: header
	};

}

export function getData(type, id, parameters) {

	var requestOptions = _requestOptions(type, id, parameters);

	return new Promise((resolve, reject) => {
		var string = '';
		var request = https.request(requestOptions, res => {
			
			//set the encoding
			res.setEncoding('utf8');
			
			//define what to do with the data
			res.on('data', (chunk) => {
				string += chunk;
			});

			//tell us when everything is written.
			res.on('end', () => {
				resolve(JSON.parse(string));
			});

		});

		//define error scenarios
		request.on('error', (e) => {
		  reject(e.message);
		});

		// write data to request body
		request.write('');
		request.end();
	
	});

}

export function getTransactions(location, start, end) {

	var requestOptions = _requestOptions(location, 'transactions', start, end);

	var string = '';

	console.log(requestOptions);

	return new Promise((resolve, reject) => {

		var request = https.request(requestOptions, res => {
			
			//set the encoding
			res.setEncoding('utf8');
			
			//define what to do with the data
			res.on('data', (chunk) => {
				string += chunk;
			});

			//tell us when everything is written.
			res.on('end', () => {
				resolve(JSON.parse(string));
			});

		});

		//define error scenarios
		request.on('error', (e) => {
		  reject(e.message);
		});

		// write data to request body
		request.write('');
		request.end();

	});

}

export function getRefunds(location, start, end) {
	var requestOptions = _requestOptions(location, 'refunds', start, end);

	var string = '';

	console.log(requestOptions);

	return new Promise((resolve, reject) => {

		var request = https.request(requestOptions, res => {
			
			//set the encoding
			res.setEncoding('utf8');
			
			//define what to do with the data
			res.on('data', (chunk) => {
				string += chunk;
			});

			//tell us when everything is written.
			res.on('end', () => {
				resolve(JSON.parse(string));
			});

		});

		//define error scenarios
		request.on('error', (e) => {
		  reject(e.message);
		});

		// write data to request body
		request.write('');
		request.end();

	});

}
