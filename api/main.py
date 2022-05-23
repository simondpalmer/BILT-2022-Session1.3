import bs4 as bs
import re
import requests
import spacy
from spacy.matcher import DependencyMatcher
from flask import Flask, request
nlp = spacy.load('en_core_web_sm')

app = Flask(__name__)
##     result = [ token.text for token in doc ]

# GET address request
zoningSearch = 'ZONING'
zoningTypesSearch = 'Zoning districts'
zoningAbbrSearch = '14.12.070 - Building setbacks.'
input = '840, Concha Loma Drive, Carpinteria, California, 93013, United States'
#clean data and create tuple 
tuple = tuple(input.split(', '))


# GET state municipalities 
# https://api.municode.com/States/ list states
response_states = requests.get("https://api.municode.com/States/")
statesAbbr_data = response_states.json()

#check state from input address
for i in statesAbbr_data:
     for e in tuple:
          if e in i.values():
               stateAbbr = i['StateAbbreviation']


# https://api.municode.com/Clients/stateAbbr?stateAbbr=ca list of municipalities
#   check Zipcode match if match get ClientId (municipality)
# If no results check ClientName "Santa Barbara County" or "Carpinteria"

response_state_data = requests.get("https://api.municode.com/Clients/stateAbbr?stateAbbr=" + stateAbbr)
state_data = response_state_data.json()
for i in state_data:
     for e in tuple:
          if e in i.values():
               clientId = i['ClientID']

# Scan municipality code for zoning information
# https://api.municode.com/ClientContent/{ClientId}
#   GET Product name (code of ordinances)

response_muni_data = requests.get(
         "https://api.municode.com/ClientContent/" + str(clientId))
muni_data = response_muni_data.json()
for i in muni_data['codes']:
     productId = (i['productId'])

# https://api.municode.com/Jobs/latest/{productId}
#   GET Id for jobId (get job number for that latest)

response_jobs_data = requests.get("https://api.municode.com/Jobs/latest/" + str(productId))
jobs_data = response_jobs_data.json()
jobId = jobs_data['Id']

# https://api.municode.com/codesToc?jobId={jobId}&productId={productId}
#   GET Code section from Children for nodeId (DICT List all sections and SEARCH for relevant titles.
#   1. Zoning districts and name
#   2. Titles relevant to each zone. i.e. Setbacks residential)
response_code_data = requests.get("https://api.municode.com/codesToc?jobId=" + str(jobId) + "&productId=" + str(productId))
code_data = response_code_data.json()
code_titles = dict((item['Heading'], item) for item in code_data['Children'])
zoning_code = {k: v for k, v in code_titles.items() if zoningSearch in k}
for k in zoning_code:
     zoning_nodeId = zoning_code[k]['Id']

# ZONING DISTRICTS
# https://api.municode.com/CodesContent?jobId={jobId}&nodeId={nodeId}&productId={productId}
#   GET Docs (SEARCH for zoning info)
#   Check for Zone
response_zone_code_data = requests.get("https://api.municode.com/CodesContent?jobId=" + str(jobId) + "&nodeId=" + str(zoning_nodeId) + "&productId=" + str(productId))
zone_code_data = response_zone_code_data.json()

#print(zone_code_data)

#reorder json into dictionary with keys representing Ordinance Titles
zoning_json = dict((item['Id'], item)
     for item in zone_code_data['Docs'] if zoningTypesSearch in item['Title'])

zoning_sel_json = dict((item['Id'], item) for item in zone_code_data['Docs'] if zoningAbbrSearch in item['Title'])

zone_sel_ord_nodeId = list(zoning_sel_json.keys())[0]

response_zone_sel_districts_data = requests.get("https://api.municode.com/CodesContent?jobId=" + str (jobId)  + "&nodeId=" + str (zone_sel_ord_nodeId) + "&productId=" + str(productId))  
zone_district_sel_data = response_zone_sel_districts_data.json()

#Get content of setback info
zone_setback_content = dict((item['Id'], item) for item in zone_district_sel_data['Docs'] if zoningAbbrSearch in item['Title'])
#print(zone_setback_content)
for k in zone_setback_content:
    setback_content = zone_setback_content[k]['Content']

setback_text = []
soup = bs.BeautifulSoup(setback_content, 'html')
##article = soup.find_all('p')
for strings in soup.stripped_strings:
     s = re.sub("\n", "", strings)
     n = re.sub("\s{2,}", " ", s)
     setback_text.append(n)

doc = nlp(setback_text)


matcher = DependencyMatcher(nlp.vocab)

pattern = [
    {
        "RIGHT_ID": "anchor_distance",
        "RIGHT_ATTRS": {"POS": "NUM"}
    },
    {
        "LEFT_ID": "anchor_distance",
        "REL_OP": "<<",
        "RIGHT_ID": "setback_constraint",
        "RIGHT_ATTRS": {"POS": {"IN" : ["AUX", "VERB"]}}
    },
    {
        "LEFT_ID": "setback_constraint",
        "REL_OP": ">>",
        "RIGHT_ID": "setback_type",
        "RIGHT_ATTRS": {"POS": "ADJ"}
    },
    {
        "LEFT_ID": "setback_constraint",
        "REL_OP": ">>",
        "RIGHT_ID": "setback_condition",
        "RIGHT_ATTRS": {"DEP": "pobj"}
    },
    {
        "LEFT_ID": "setback_condition",
        "REL_OP": ">>",
        "RIGHT_ID": "setback_condition_detail",
        "RIGHT_ATTRS": {"DEP": "compound"}
    }
]
#Match for setbacks
matcher = DependencyMatcher(nlp.vocab)
matcher.add("SETBACKS", [pattern])
matches = matcher(doc)
matched = []
match_id, token_ids = matches[0]
for i in range(len(token_ids)):
    matched.append(pattern[i]["RIGHT_ID"] + ":", doc[token_ids[i]].text)

@app.route('/')
def new_report():
    return {
         "results":matched
    }
if __name__ =="__main__":
     app.run(host="0.0.0.0", port=5050)
