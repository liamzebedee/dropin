const fs = require('fs');
const env = require('jsdom').env;
const jquery = require('jquery');
const moment = require('moment');

let dataFile = process.argv[2];
let subjectNum = process.argv[3];
// console.log(`Processing subject ${subjectNum} for data file ${dataFile}`);

let html = fs.readFileSync(dataFile);

let log = (txt) => console.log(txt);

env({ html: html, done: function (errors, windowObj) {
	if(errors) {
		throw new Error(errors);
	}
	parse(jquery(windowObj));

	windowObj.close();
}});

Object.values = Object.values || function(o){return Object.keys(o).map(function(k){return o[k]})};


class SubjectInfo {
	constructor(subjectNumber) {
		this.subjectNumber = subjectNumber;
		this.sessions = {};
	}

	updateSessionDetails(sessionName, details) {
		this.sessions[sessionName] = details
	}

	toMongoObj() {
		return { subjectNumber: this.subjectNumber, sessions: Object.values(this.sessions) };
	}
}

class SessionDetails {
	constructor(sessionName) {
		this.sessionName = sessionName;
		this.classes = [];
	}

	addClass(classs) {
		this.classes.push(classs)
	}
}

function parse($) {
	
let subjectInfo = new SubjectInfo(subjectNum)
let currentSession = null;
const DAYS = `Mon Tue Wed Thu Fri Sat Sun`.split(' ');

$('table[cellpaddinng=1] tr').each((i,el)=>{

    // New session.
    if(el.bgColor == '#cccccc' && el.align == "LEFT") {
    	let text = $('a',el).first().attr('href');
    	currentSession = new SessionDetails(text);
    }
    if(el.bgColor == '#eeeeee') {
    	let items = $('td', el).get().map((el) => el.textContent);

    	let items_group = items[0].replace(/^\s+|\s+$/g, '');
    	let items_activity = items[1].replace(/^\s+|\s+$/g, '');
    	let items_day = items[2].replace(/^\s+|\s+$/g, '');
    	let items_startTime = items[3].replace(/^\s+|\s+$/g, '');
    	let items_duration = items[4].replace(/^\s+|\s+$/g, '');
    	let items_location = items[5].replace(/^\s+|\s+$/g, '');
    	let items_weeks = items[7].replace(/^\s+|\s+$/g, '');

    	let duration_mins = new Number(items_duration.split(' ')[0])

    	var locationInfo = items_location.trim();
		if(locationInfo == '') {
			return;
		}
    	var locations = items_location.match(/C[a-zA-Z0-9][^\s]+/g);
		if(!locations || !locations[0]) {
			return;
			// console.log(locationInfo)
			// throw new Error("Can't find full location for "+timetableFile);
		}
		var classLocation = locations[0].split('.');

		let classType = ''+items_group[0]+items_group[1]+items_group[2];

		

		// Parse item_weeks
		// "5/8-16/9, 7/10-4/11"
		// "9/6"
		let weeksOn = items_weeks.split(', ').map((period) => period.split('-').map((dateStr) => moment(dateStr, "D/M")))
		

		// .format() is essential to converting it into 24 hour format in our timezone.
		// http://stackoverflow.com/questions/24225142/why-does-moment-js-not-parse-24-hour-dates-correctly
		let startingTime = moment(items_startTime, "HH:mm Z+1000").format();
		let durationInMins = +(items_duration.split(' ')[0]);
		let endTime = moment(startingTime).add(durationInMins, 'm').format();

		let day = DAYS.indexOf(items_day);

    	let classInfo = {
			startingTime: startingTime,
			durationInMins: durationInMins,
			endTime: endTime,
			day: day,
			location: items_location,
			building: classLocation[0],
			level: classLocation[1],
			room: classLocation[2],
			classType: classType,
			weeksOn: weeksOn
		};
		
		currentSession.addClass(classInfo);
		subjectInfo.updateSessionDetails(currentSession.sessionName, currentSession)
    }
});


console.log(JSON.stringify(subjectInfo.toMongoObj(), null, 2))




}

