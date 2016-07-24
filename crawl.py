# uts crawler
# @liamz

# import urllib.request
import os
import re
import sys
import json


def cmd(bash):
	# print(bash, file=sys.stderr)
	return os.popen(bash).read()

cmd('rm cookies.txt')


initial_setup_url = "curl 'https://mysubjects.uts.edu.au/aplus2016/apstudent?forced=true' --cookie-jar cookies.txt"
cmd(initial_setup_url)

username = '97117877'
password = 'June1997!' # url encoded btw
login_creds = 'student_code='+username+'&password='+password


login_url = "curl 'https://mysubjects.uts.edu.au/aplus2016/apstudent?fun=login' -H 'Origin: https://mysubjects.uts.edu.au' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: https://mysubjects.uts.edu.au/aplus2016/apstudent?forced=true' -H 'Connection: keep-alive' --data '" + login_creds + "' -b cookies.txt --compressed --cookie-jar cookies.txt"

res = cmd(login_url)
# then you get a html shitty 2004 router iframe response
# find the iframe url param 'ss'
studentsession = re.search(r"ss=[\dabcdef]{32}", res).group(0).split('=')[1]
jsessionid = re.search(r"jsessionid=[\w.-]{46}", res).group(0).split('=')[1] #4A47A2A73534CC552C651181E3A06B81.aplus-2016-90
#login_token = '06bc0132c4e04669bdb3bbd691ef0e90'

print("Got token "+studentsession)
print("Got jsessionid "+jsessionid)



def get_sessions_for_subject_code(subject_code):
	curl_cmd = "curl 'https://mysubjects.uts.edu.au/aplus2015/aptimetable?fun=unit_select' -b cookies.txt -H 'Origin: https://mysubjects.uts.edu.au' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: https://mysubjects.uts.edu.au/aplus2015/aptimetable?fun=unit_select_clear' -H 'Connection: keep-alive' --compressed --data 'student_set=&teaching_periods=ALL&campuses=ALL&filter_name=&faculty=ALL&activity_types=ALL&day=Mon&day=Tue&day=Wed&day=Thu&day=Fri&day=Sat&day=Sun&after_time=08%3A00&before_time=23%3A00&filter="+subject_code+"'"
	sessions_file = 'tmp/{}.sessions.html'.format(subject_code)
	curl_cmd += ' > ' + sessions_file
	cmd(curl_cmd)

	sessions = cmd('node 1_extract_subject_sessions.js '+sessions_file).strip().split(',')

	return sessions

def download_timetable_for_subject_codes(subject, subject_codes):
	# 31247_AUT_U_1_S
	subject_codes_to_query = ""
	for subject_code in subject_codes:
		subject_codes_to_query += "assigned="+subject_code+"&"

	# Fetches a flat timetable
	curl_cmd = "curl 'https://mysubjects.uts.edu.au/aplus2015/aptimetable?fun=unit_select&flat_timetable=yes' -b cookies.txt -H 'Origin: https://mysubjects.uts.edu.au' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Cache-Control: max-age=0' -H 'Referer: https://mysubjects.uts.edu.au/aplus2015/aptimetable?fun=unit_select' -H 'Connection: keep-alive' --data 'student_set=&teaching_periods=ALL&campuses=ALL&filter=&filter_name=&faculty=ALL&{}activity_types=ALL&day=Mon&day=Tue&day=Wed&day=Thu&day=Fri&day=Sat&day=Sun&after_time=08%3A00&before_time=23%3A00' --compressed".format(subject_codes_to_query)
	file = 'tmp/{}.timetables.html'.format(subject)
	
	curl_cmd += ' > ' + file
	cmd(curl_cmd)

	# timetable_data = cmd('node 2_extract_subject_timetable.js '+file).strip().split(',')


# now to get the times for all subjects
def scrape_data():
	subjects_file = open('subjects.json')
	subject_data = json.load(subjects_file)
	subject_i = 0
	for subject in subject_data:
		get_command_for_download_subject_session_timetable(subject['subjectCode'], subject_i)
		
		subject_i += 1

	subjects_file.close()

if __name__ == '__main__':
	subject = '48023'
	sessions = get_sessions_for_subject_code(subject)
	download_timetable_for_subject_codes(subject, sessions)


