#!/bin/bash
touch timetableData.json
for filename in rawtimetables/*.html; do
	echo $filename
	node parse.js $filename >> timetableData.json
done