#!/bin/bash
echo '[' > timetableData.json
for filename in rawtimetables/*.json; do
	number=$(echo $filename | grep -o '\<[[:digit:]]*')
	#echo $number
	echo -e {\"$number\": >> timetableData.json
	cat $filename >> timetableData.json
	echo '},' >> timetableData.json
done
echo ']' >> timetableData.json
