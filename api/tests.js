const chai = require('chai')
const assert = chai.assert;
const request = require('request');


let apiUrl = (endpoint) => `http://localhost:8080/api${endpoint}`;





// Test subject search
// -------------------

const sampleSubj = {"subjectName":"French Language and Culture 5","subjectId":"97405"}

request(apiUrl(`/subjects/search?q=${sampleSubj.subjectId}`), function (error, response, body) {
	let data = JSON.parse(body)

	assert.equal(response.statusCode, 200);
	assert.equal(data[0].subjectName, sampleSubj.subjectName)
})



// Test nearby search
// ------------------

const param_building = "CB10";
const param_hour = 10;
const param_day = 0; // mon
request(apiUrl(`/classes/search?building=${param_building}&hour=${param_hour}&day=${param_day}`), function (error, response, body) {
	console.log(body)
	
	let data = JSON.parse(body);
	console.log(body)
	console.log(data[0].subject)

	assert.equal(response.statusCode, 200);
})