var fs = require('fs');

var subjectsToInject =  JSON.parse(fs.readFileSync('subjects.json'));
var classes = JSON.parse(fs.readFileSync('timetableData.json'));

console.log(subjectsToInject[0]);
console.log(classes[0]);

for (var i = 0; i < subjectsToInject.length; i++ ){
  var subjNumber = subjectsToInject[i]['subjectCode'];
  for ( var j = 0; j < classes.length; j++ ){
    if (classes[j][subjNumber] != null){
      classes[j][subjNumber]['subjectName'] = subjectsToInject[i]['subjectName'];
      console.log(subjNumber,classes[j]);
    }
  }

}
console.log(classes.length);
fs.writeFileSync('ingest.json', JSON.stringify(classes));
