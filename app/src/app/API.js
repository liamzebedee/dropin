import Q from 'q';
import 'whatwg-fetch';

const MOCK_DATA = true;
let API_BASE = "";
if(MOCK_DATA) {
	API_BASE = "http://localhost:8080/api"
}


var moment = require('moment');

function promiseFromData(data) {
	return Q.fcall(() => data);
}

export default class API {
	static searchSubjectsByText(query) {
		console.log(`Searching for subjects sounding like ${query}`)
		// if(MOCK_DATA) return promiseFromData(MOCK_SUBJECTS_BY_TEXT)

		let res = fetch(`${API_BASE}/subjects/search?q=${query}`).then((res) => res.json());
		return res;
	}

	static searchNearbyClasses(building, currentTime = new Date) {
		let hour = currentTime.getHours()
		let DAYS = "Mon Tue Wed Thu Fri Sat Sun".split(' ')

		let day = (currentTime.getDay() + 6) % 7; // we begin on Monday = 0
		if(day >= 5) {
			day = 0;
		}

		let dayStr = DAYS[day];
		console.log(`Searching for subjects near ${building} around ${hour} on ${dayStr}day`)

		let res = fetch(`${API_BASE}/classes/search?building=${building}&day=${day}&hour=${hour}`)
      .then((res) => res.json());

		//if(MOCK_DATA) return promiseFromData(MOCK_CLASSES_BY_TEXT);
    return res;

	}

	static getSubjectInfo(id) {
		console.log(`Getting info for subject ${id}`)
		if(MOCK_DATA) return promiseFromData(MOCK_SUBJECT_INFO)
	}
}



// subjectNumber
// subjectTitle
// http://handbook.uts.edu.au/subjects/{subjectNumber}.html
// http://handbook.uts.edu.au/subjects/details/54083.html

// startingTime: startingTime,
// durationInMins: durationInMins,
// endTime: endTime,
// day: day, // 0-6 index
// location: items_location,
// building: classLocation[0],
// level: classLocation[1],
// room: classLocation[2],
// classType: classType,
// weeksOn: weeksOn // We don't need to know

const MOCK_SUBJECTS_BY_TEXT = [
	{
		id: "1",
		subjectName: "Introduction to Swag",
		subjectCode: "42000",
		description: "In this subject students undertake a rigorous and detailed analysis of the notions of sex, gender and sexuality in a wide variety of cultural and social contexts. Students examine in depth how social and political institutions function to regulate sex, gender and sexuality, how gender analysis helps us understand contemporary social and political issues, and how gender and sexual identities are embodied and performed in everyday life.",
		classes: [
			{
				id: "1",
				classType: "TUT",
				location: "CB11.02.101",
				howLong: 90,

				hour: 1,
				min: 0,
				day: 3,
			},
		],
	},
];

const MOCK_CLASSES_BY_TEXT = [
	{
		id: "1",
		classType: 'TUT',
		hour: 1,
		min: 0,
		subjectName: "Advanced Swag Fundamentals",
		subjectCode: "42000",
		howLong: 90,
		building: "CB11",
		level: "02",
		room: "101",
		subject: {
			code: "123213",
			name: "Psychfarmacology"
		}
	},

	{
		id: "2",
		classType: 'WRK',
		hour: 1,
		min: 0,
		subjectName: "Advanced Swag Fundamentals",
		subjectCode: "12312",
		howLong: 90,
		building: "CB11",
		level: "02",
		room: "101",
		subject: {
			code: "123213",
			name: "Psychfarmacology"
		}
	},

{
  subjectName: "Introduction to Swag",
  subjectCode: "42000",
  description: "In this subject students undertake a rigorous and detailed analysis of the notions of sex, gender and sexuality in a wide variety of cultural and social contexts. Students examine in depth how social and political institutions function to regulate sex, gender and sexuality, how gender analysis helps us understand contemporary social and political issues, and how gender and sexual identities are embodied and performed in everyday life.",
  classes: [
  {
    classType: "TUT",
    location: ["CB11", "02", "101"],
    howLong: 90,

    hour: 1,
    min: 2,
    day: 3
  }
  ]
}
];

const MOCK_1CLASSES_BY_TEXT = [
{
  classType: 'TUT',
  hour: 1,
  min: 2,
  subjectName: "Advanced Swag Fundamentals",
  subjectCode: "42000",
  howLong: 90,
  building: "CB11",
  level: "02",
  room: "101",
},

{
  classType: 'WRK',
  hour: 1,
  min: 2,
  subjectName: "Advanced Swag Fundamentals",
  subjectCode: "12312",
  howLong: 90,
  building: "CB11",
  level: "02",
  room: "101",
}
];


const MOCK_SUBJECT_INFO = MOCK_SUBJECTS_BY_TEXT[0];
