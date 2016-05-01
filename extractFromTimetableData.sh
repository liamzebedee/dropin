#!/bin/bash
touch timetableData.json
# echo '{"data":[' >> timetableData.json
for filename in rawtimetables/*.html; do
	name=${filename##*/}
	echo $name
	if [[ $name < 77894 ]]; then
		continue
	fi
	# echo $filename
	node parse.js $filename > $filename.json
	# echo ',' >> timetableData.json
done
# echo ']}' >> timetableData.json