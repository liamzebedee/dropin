const MOCK_DATA = true;

export default class API {
	static searchSubjectsByText(query) {
		console.log(`Searching for subjects sounding like ${query}`)

		if(MOCK_DATA) return MOCK_SUBJECTS_BY_TEXT;
		return [];
	}

	static searchNearbyClasses(building, currentTime) {
		console.log(`Searching for subjects near ${building} around ${currentTime}`)
		if(MOCK_DATA) return MOCK_CLASSES_BY_TEXT;
		
		return [];
	}

	static getSubjectInfo(id) {
		if(MOCK_DATA) return MOCK_SUBJECT_INFO;

		return {};
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
				location: ["CB11", "02", "101"],
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
];


const MOCK_SUBJECT_INFO = MOCK_SUBJECTS_BY_TEXT[0];