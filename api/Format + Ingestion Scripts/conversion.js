var fs = require('fs');
var originalSubjectTest = JSON.parse(fs.readFileSync('preformatted.json'));
var moment = require('moment');

var finalOut = [];

for (var i =0; i<originalSubjectTest.length; i++){

  var newForm = {
    subjectName:'',
    subjectId:'',
    sessions:[]
  }
  //console.log(originalSubjectTest[i],Object.keys(originalSubjectTest[i])[0]);
  newForm.subjectId = Object.keys(originalSubjectTest[i])[0];
  newForm.subjectName = originalSubjectTest[i][newForm.subjectId].subjectName;
  newForm.sessions = originalSubjectTest[i][newForm.subjectId].sessions;
  var subj = originalSubjectTest[i][newForm.subjectId];
  //Convert starting time
  for(var j = 0; j < subj.sessions.length; j++){
    if (subj.sessions[j].classes){
      for (var k=0; k< subj.sessions[j].classes.length; k++){
        newForm.sessions[j].classes[k].startHour = new Number(
          moment(subj.sessions[j].classes[k].startingTime).format("HH")
          );
        newForm.sessions[j].classes[k].startMin = new Number(
          moment(subj.sessions[j].classes[k].startingTime).format("mm")
          );
        delete subj.sessions[j].classes[k].startingTime;
        console.log(newForm.sessions[j].classes[k].startHour);
      }
    }
  }
  //console.log(JSON.stringify(newForm.subjectName));
  finalOut.push(newForm);
}
fs.writeFileSync('ingest.json', JSON.stringify(finalOut));
