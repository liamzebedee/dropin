#!/bin/bash
for filename in rawtimetables/*.html; do
	node parse.js $filename
done