var PouchDB = require('pouchdb');
var db = new PouchDB('./timetableData/');
var parsedJSON = require('./rawtimetables/data.json');

console.log(JSON.stringify(parsedJSON.data.filter(function(el) {
	var x = false;
	el.classes.forEach(function(el2) {
		if(el2.day === 1 && el2.hour === 9 && el2.building === 'CB11') x=true; return;
	})
	return x;
})))

// db.bulkDocs(parsedJSON.data);

// var info = db.info().then(function(){

// console.log(info);
// console.log(parsedJSON.data.length);

// })