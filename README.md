dropin UTS
==========

Drop in to any subject at UTS, near you and search for ones too!

Tech details:
 - Chrome Dev Tools to produce curl commands to download timetable data
 - JQuery to scrape and parse the subject numbers (`getSubjects.js`)
 - Python and curl to download timetables (`crawl.py`)
 - Node/JS with JQuery to interpret and parse timetable into JSON (`parse.js`)
 - Some Bash to mash it all together (`extractFromTimetableData.sh`)
 - Webpack + ES6 + React.js + Material UI for a frontend



## Other documentation of process
 - Some subjects just have a 'an unexpected error has occurred'. Try ignore these. e.g. `node parse.js 11525.html` should return empty array and not error.
 - Subject `010042` has a weird format where there is no location -- CNR - CLASS NOT REQUIRED
 - Subject `11172` has a weird format for the location.
 - some random stuff in the JSON at 92510

 MP.01.02
MP.01.01

 - NEED TO FIX FOR 25556


## App
 1. `nvm install 6;nvm use 6 && nvm alias default 6`
 2. `npm install`
 3. `npm start`
