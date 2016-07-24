const fs = require('fs');
const env = require('jsdom').env;
const $ = require('jquery');




let dataFile = process.argv[2];
let html = fs.readFileSync(dataFile);

env({ html: html, done: function (errors, windowObj) {
	if(errors) {
		console.log(errors);
		throw new Error();
	}
	parse($(windowObj));

	windowObj.close();
}});

function parse($el) {

}
