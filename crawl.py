# uts crawler
# @liamz

# import urllib.request
import os
import re
import sys
from bs4 import BeautifulSoup
import json


def cmd(bash):
	# print(bash, file=sys.stderr)
	return os.popen(bash).read()

cmd('rm cookies.txt')


initial_setup_url = "curl 'https://mysubjects.uts.edu.au/aplus2016/apstudent?forced=true' --cookie-jar cookies.txt"
cmd(initial_setup_url)

username = '97117877'
password = '' # url encoded btw
login_creds = 'student_code='+username+'&password='+password


login_url = "curl 'https://mysubjects.uts.edu.au/aplus2016/apstudent?fun=login' -H 'Origin: https://mysubjects.uts.edu.au' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: https://mysubjects.uts.edu.au/aplus2016/apstudent?forced=true' -H 'Connection: keep-alive' --data '" + login_creds + "' -b cookies.txt --compressed --cookie-jar cookies.txt"

res = cmd(login_url)
# print(res)
# then you get a html shitty 2004 router iframe response
# find the iframe url param 'ss'
studentsession = re.search(r"ss=[\dabcdef]{32}", res).group(0).split('=')[1]
jsessionid = re.search(r"jsessionid=[\w.-]{46}", res).group(0).split('=')[1] #4A47A2A73534CC552C651181E3A06B81.aplus-2016-90
#login_token = '06bc0132c4e04669bdb3bbd691ef0e90'
print("Got token "+studentsession)
print("Got jsessionid "+jsessionid)



def getInfoForSubject(subjectNo, index):
	print('Get info for '+subjectNo+ ' at '+str(index))
	cmd("curl 'https://mysubjects.uts.edu.au/aplus2016/apstudent?fun=subjectTimetableOptions&ss="+str(studentsession)+"' -b cookies.txt -H 'Origin: https://mysubjects.uts.edu.au' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: https://mysubjects.uts.edu.au/aplus2016/apstudent?fun=subjectTimetableSearch&ss="+str(studentsession)+"' -H 'Connection: keep-alive' --data 'subject_code="+str(subjectNo)+"' --compressed")


	url = "curl 'https://mysubjects.uts.edu.au/aplus2016/apstudent?fun=subjectTimetable&subject_code="+str(subjectNo)+"_AUT_U_1_S&ss="+str(studentsession)+"' -b cookies.txt -H 'Referer: https://mysubjects.uts.edu.au/aplus2016/apstudent?fun=subjectTimetableOptions&ss="+str(studentsession)+"' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Connection: keep-alive' --compressed" + " > " + "rawtimetables/"+subjectNo+".html"
	
	cmd(url)


# # now to get the times for all subjects
subjects_file = open('subjects.json')
subject_data = json.load(subjects_file)
subject_i = 0
for subject in subject_data:
	# FOR ISSUES
	if subject_i < 1353: 
		subject_i += 1
		continue

	getInfoForSubject(subject['subjectCode'], subject_i)
	subject_i += 1
subjects_file.close()


# timetableData = BeautifulSoup(res, "html.parser")



# data = timetableData.select("table.gridtable")
# print(timetableData.findAll('td', class_='gridbottomtd')[0].parent)

# # exit(0)
# i = 0
# for timeslot in timetableData.children:
# 	# 	ignore first element which is header
# 	i += 1
# 	if i == 1:
# 		continue

# 	normal_i = i - 1

# 	current_hour = (normal_i * 15) // 60
# 	current_min = (normal_i * 15) % 60


	# every 4 elements is one hour, starting from 9am going to 9pm
	# thus there are 12*4= 48 elements to look at
	# print(timeslot.prettify())

	# # each a <tr>
	# skip_first = False
	# if current_min == 0:
	# 	skip_first = True

	# print(str(timeslot))



	# day_i = 0
	# for day in timeslot.children:
	# 	day_i += 1

	# 	# print("Day "+str(day_i)+" "+str(day))

	# 	# print(day['class'])
	# 	# print(day['class'])

	# 	if 'gridbottomtd' in day['class']:
	# 		# print(day)
	# 		duration = int(day['rowspan']) * 15
	# 		print('Class beginning at '+str(current_hour)+'h'+str(current_min)+' going for '+str(duration)+" minutes")

	# print(str(timeslot))


	# 	within those elements, there are 7 children. One <td> for each day
	# 	anything != "<td class="gridlefttd" style="background:#eeeeee;">&nbsp;</td>" is info
	# 	just replace <br> with \n and it looks like:
	# 	<td valign="top" class="gridbottomtd" style="background:#6a98c4;" rowspan="6">21591_SPR_U_1_S<br>Tut1, 01<br>Room shown 2 wks before session <br>1/8-5/9, 19/9-17/10<br></td>


# print(data)
# print(len(data))
# print(timetableData.prettify())





# 	fuck that, just regex:
# 54032_AUT_U_1_S
# Wrk2, 04
# CB03.01.005 
# 18/4


# subject_long_code
# (Wrk|Tut|Lec|Brk)%d(, 04)
# location_str
# random

# the end app will look like:
# building_code, level, room => subject_code, subject_class_type
# subject_code => subject_name


