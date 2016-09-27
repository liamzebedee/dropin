var fs = require('fs');

var subjects = JSON.parse(fs.readFileSync('classes.json'));

let classes = [];

function makeSessionNameFuckingNice(seshName) {
	// "77901_AUT_U_1_S"
	let code = seshName.substring(seshName.indexOf('_')+1)
	return {
		code: code,
		trimester: code.substring(0,3)
	}
}

subjects.forEach((subject) => {
	let classInfoBase = {
		session: {},
		subjectId: ""
	};

	classInfoBase.subjectId = subject.subjectId;

	subject.sessions.forEach((session) => {
		classInfoBase.session = makeSessionNameFuckingNice(session.sessionName);
		
		session.classes.forEach((classInfo) => {
			classes.push(Object.assign(classInfoBase, classInfo));
		})
	})
})

fs.writeFileSync('ingest.json', JSON.stringify(classes));
