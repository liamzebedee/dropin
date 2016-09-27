var fs = require('fs');

var subjects = JSON.parse(fs.readFileSync('subjects.json'));

let subjectInfos = [];

subjects.map((subject) => {
	subjectInfos.push({ code: subject.subjectCode, name: subject.subjectName });
})

fs.writeFileSync('ingest.json', JSON.stringify(subjectInfos));