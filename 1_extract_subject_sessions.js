const fs = require('fs');
const env = require('jsdom').env;
const jquery = require('jquery');

let dataFile = process.argv[2];
let html = fs.readFileSync(dataFile);

let log = (txt) => console.log(txt);

env({ html: html, done: function (errors, windowObj) {
	if(errors) {
		throw new Error(errors);
	}
	parse(jquery(windowObj));

	windowObj.close();
}});

function parse($) {
	let subjectCodes = $('select[name=unassigned]').find('option').map((i,el)=>el.value);
	// remove the pick from the following
	if(subjectCodes[0] == "Pick from the following:") {
		subjectCodes.splice(0, 1);
	}
	log(subjectCodes.get().map(el => el.replace("\n", "")).filter((el)=>el).join(','));
}

