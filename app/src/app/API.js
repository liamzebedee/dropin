import Q from 'q';
import 'whatwg-fetch';

const MOCK_DATA = true;
var moment = require('moment');

function promiseFromData(data) {
	return Q.fcall(() => data);
}

export default class API {
	static searchSubjectsByText(query) {
		console.log(`Searching for subjects sounding like ${query}`)
		// if(MOCK_DATA) return promiseFromData(MOCK_SUBJECTS_BY_TEXT)

		let res = fetch(`http://localhost:8080/api/subjects/search?q=${query}`).then((res) => res.json());
		return res;
	}

	static searchNearbyClasses(building, currentTime) {
		console.log(`Searching for subjects near ${building} around ${currentTime}`)
		if(MOCK_DATA) return promiseFromData(MOCK_CLASSES_BY_TEXT);
		
		return [];
	}

	static getSubjectInfo(id) {
		console.log(`Getting info for subject ${id}`)
		if(MOCK_DATA) return promiseFromData(MOCK_SUBJECT_INFO)

    fetch('http://localhost:8080/api/subjects/upcoming', {
      method: 'POST',
      mode:'no-cors',
      body: {
        building,
        day: moment(currentTime).toDate().getDay(),
        hour: moment(currentTime).toDate().getHours(),
      },
    }).then((err,res)=>{
      console.log(res);
    })
    //if(MOCK_DATA) return MOCK_CLASSES_BY_TEXT;
    //return [];
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
<<<<<<< afdc4c34e6a790ef28b27eab4c653c09d28d989a
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
				day: 3
			}
		]
	}
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
	}
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

const MOCK_CLASSES_BY_TEXT = [
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
