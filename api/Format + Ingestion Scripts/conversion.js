var fs = require('fs');
var originalSubjectTest = JSON.parse(fs.readFileSync('preformatted.json'))

var finalOut = [];

for (var i =0; i<originalSubjectTest.length; i++){

  var newForm = {
    subjectName:'',
    subjectId:'',
    sessions:[]
  }
  console.log(originalSubjectTest[i],Object.keys(originalSubjectTest[i])[0]);
  newForm.subjectId = Object.keys(originalSubjectTest[i])[0];
  newForm.subjectName = originalSubjectTest[i][Object.keys(originalSubjectTest[i])[0]].subjectName;

  newForm.sessions = originalSubjectTest[i][Object.keys(originalSubjectTest[i])[0]].sessions;

  console.log(JSON.stringify(newForm.subjectName));
  finalOut.push(newForm);
}
fs.writeFileSync('ingest.json', JSON.stringify(finalOut));
