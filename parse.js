var fs = require('fs');
var env = require('jsdom').env;
var jq = require('jquery');

var allClassesEVER = [];

var timetableFile = process.argv[2];
// console.log(timetableFile);
var subjectCode = timetableFile.split('/')[1].split('.html')[0];
// 'rawtimetables/12311.html'
var html = fs.readFileSync(timetableFile);
// first argument can be html string, filename, or url
// console.log(timetableFile);

env({ html: html, done: function (errors, windowObj) {
	if(errors) {
		console.log(errors);
		throw new Error();
	}
	getClassesFromTimetable(jq(windowObj));

	windowObj.close();
}});



function getClassesFromTimetable($) {
	// console.log('getting');
	var classes = [];
	var mapFromDayToNumberofSlots = [];

	var mainTable = $('.gridtable tbody tr');
	if(!mainTable) return [];

	mainTable.each(function(i, el){
		// ignore the first element which is the header
		if(i === 0) {
			// day => colspan

			// 2+1+1+3+3+1+1 = 12
			// Monday Monday Tuesday Wednesday Thursday Thursday Thursday Friday Friday Friday Saturday Sunday


			$('td', el).each(function(k, elTd){
				if(k === 0) return;

				var span = 0 + $(elTd).prop("colSpan");
				for(var x = 0; x < span; x++) {
					mapFromDayToNumberofSlots.push(k - 1); // day is zero-based
				}
			});

			// console.log(mapFromDayToNumberofSlots);

			return;
		}

		var properI = i - 1;

		var totalMins = properI * 15;

		var min = totalMins % 60;
		var hour = 9 + (+(totalMins/60).toFixed(0));



		var skippedHeader = 0;

		$('td', el).each(function(i, elTd){
			var z = $(elTd);

			if(z.html() === '&nbsp;') {
				return;
			}
			if(z.prop('rowspan') == 4) {
				skippedHeader = -1;
				return;
			}


			// console.log(i);
			var day = mapFromDayToNumberofSlots[i + skippedHeader];
			var howLong = (0+z.prop('rowspan')) * 15; // in minutes
			// console.log(day + 'th day @ '+hour+':'+min+' for '+howLong+' minutes');


			// 54064_AUT_U_1_S<br>Sem1, 02<br>CB10.05.330 <br>23/3-20/4, 4/5-8/6<br>

			var classInfo = z.html().split('<br>');
			var info_subject = 0;
			var info_session = 1;
			var info_location = 2;

			var classTypeAndNumber = classInfo[info_session].split(', ')[0];
			var classType = ''+classTypeAndNumber[0]+classTypeAndNumber[1]+classTypeAndNumber[2];

			var locationInfo = classInfo[info_location].trim();
			if(locationInfo == '') {
				return;
			}

			// only match city campus with regex
			var locations = classInfo[info_location].match(/C[a-zA-Z0-9][^\s]+/g);
			if(!locations || !locations[0]) {
				return;
				// console.log(locationInfo)
				// throw new Error("Can't find full location for "+timetableFile);
			}
			var classLocation = locations[0].split('.');


			var classInfo = {
				day: day,
				hour: hour,
				min: min,
				howLong: howLong,
				location: classLocation,
				building: classLocation[0],
				level: classLocation[1],
				room: classLocation[2],
				classType: classType,
			};

			classes.push(classInfo);
		});
	});	

	console.log(JSON.stringify({
		subjectCode: subjectCode,
		classes: classes
	}));

	return classes;
}