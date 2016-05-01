dropin UTS
==========

 - `crawl.py` gets the HTML timetables for every subject
 - `parse.js` parses it using JQuery etc. into a JSON object



## Other documentation of process
 - Some subjects just have a 'an unexpected error has occurred'. Try ignore these. e.g. `node parse.js 11525.html` should return empty array and not error.
 - Subject `010042` has a weird format where there is no location -- CNR - CLASS NOT REQUIRED
 - Subject `11172` has a weird format for the location.



## Design
Filter by building code and level
Search by keywords for class
