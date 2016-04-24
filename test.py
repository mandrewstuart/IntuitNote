import requests
import json
payload = {'id': 5}
r = requests.post('http://localhost:5000/autoTag', json=(payload))
