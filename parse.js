var fs = require('fs');
var env = require('jsdom').env;
var jq = require('jquery');

var allClassesEVER = [];


fs.readdirSync('rawtimetables/').forEach(function(file) {
	var html = fs.readFileSync('rawtimetables/'+file);
	// first argument can be html string, filename, or url
	console.log(file);

	env({ html: html, done: function (errors, windowObj) {
		if(errors) {
			console.log(errors);
			throw new Error();
		}
		getClassesFromTimetable(jq(windowObj));

	}});
});



function getClassesFromTimetable($) {
	console.log('getting');
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

			console.log(mapFromDayToNumberofSlots);

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
			console.log(day + 'th day @ '+hour+':'+min+' for '+howLong+' minutes');

			// 0 = subject
			// 1 = session
			// 2 = location
			// 3 = IDWTFTI

			// 54064_AUT_U_1_S<br>Sem1, 02<br>CB10.05.330 <br>23/3-20/4, 4/5-8/6<br>

			var classInfoSplitUpToBeProcessed = z.html().split('<br>');
			var classTypeAndNumber = classInfoSplitUpToBeProcessed[1].split(', ')[0];
			var classType;
			switch(classTypeAndNumber[0]) {
				case 'C':
					classType = 'Cmp';
					break;
				case 'L':
					classType = 'Lec';
					break;
				case 'T':
					classType = 'Tut';
					break;
				default:
					classType = classTypeAndNumber[0]+classTypeAndNumber[1]+classTypeAndNumber[2];
					break;
			}

			var classLocation = classInfoSplitUpToBeProcessed[2].trim().split('.');


			var classInfo = {
				day: day,
				hour: hour,
				min: min,
				howLong: howLong,
				location: classLocation,
				building: classLocation[0],
				level: classLocation[1],
				room: classLocation[2],
				classType: classType
			};

			classes.push(classInfo);
		});
	});	

	console.log(JSON.stringify(classes));

	return classes;
}