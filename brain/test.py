import requests



#/createSubject
#requires name and user_ID

payload = {'name': 'test subject name', 'user_id':'12345abc'}
x = requests.post('http://localhost:5000/createSubject',json=payload)
x.status_code
x.content


#@post('/getSubjects')
#requires user_id
payload = {'user_id':'12345abc'}
x = requests.post('http://localhost:5000/getSubjects',json=payload)
x.status_code
x.content


#@post('/updateSubject')
#requires name, user_id, subj_id
payload = {'user_id':'12345abc', 'subj_id': 25, 'name':'New Name Done'}
x = requests.post('http://localhost:5000/updateSubject',json=payload)
x.status_code
x.content

#@post('/deleteSubject')
#requires user_id, id
payload = {'user_id':'12345abc', 'id': 24}
x = requests.post('http://localhost:5000/deleteSubject',json=payload)
x.status_code
x.content
