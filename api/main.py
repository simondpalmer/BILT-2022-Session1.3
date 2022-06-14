import bs4 as bs
import re
import requests
import spacy
from spacy.matcher import DependencyMatcher
from spacy import displacy
from flask import Flask, request
nlp = spacy.load('en_core_web_sm')

app = Flask(__name__)
##     result = [ token.text for token in doc ]

zoningSearch = 'ZONING'
zoningAbbrSearch = 'setbacks'
input = 'Carpinteria, California, 93013, United States'

#clean data and create tuple 
tuple = tuple(input.split(', '))

@app.route('/api/new-report')
def new_report():

    # GET zone request
    zone_id = request.args.get('query')
    if zone_id == "PRD-20":
        zone_id = "PRD"
    elif zone_id == "PRD-15":
        zone_id = "PRD"
    elif zone_id == "8-R-1":
        zone_id = "R-1"
    elif zone_id == "6-R-1":
        zone_id = "R-1"
    elif zone_id == "20-R-1":
        zone_id = "R-1"
    elif zone_id == "REC":
        zone_id = "REC"
    elif zone_id == "CPD":
        zone_id = "CPD"
    elif zone_id == "M-CD":
        zone_id = "M-CD"
    elif zone_id == "PUD":
        zone_id = "PUD"
    else:
        return zone_id


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

    # ZONING DISTRICT
    # https://api.municode.com/CodesContent?jobId={jobId}&nodeId={nodeId}&productId={productId}
    #   GET Docs (SEARCH for zoning info)
    #   Check for Zone
    response_zone_code_data = requests.get("https://api.municode.com/CodesContent?jobId=" + str(jobId) + "&nodeId=" + str(zoning_nodeId) + "&productId=" + str(productId))
    zone_code_data = response_zone_code_data.json()

    # search for zone_id in Titles, retrieve firts match
    #Search all NodeDepth equals 2(i.e. sub-categories). Retrieve Title with "setback"
    zoning_sel_json = dict((item['Title'], item['Id']) for item in zone_code_data['Docs'] if item['NodeDepth'] == 2)

    zoning_sel = list(filter(lambda val: zone_id in val[0],  zoning_sel_json.items()))

    #Get id for relevant zone
    zone_sel_ord_nodeId = zoning_sel[0][1]

    response_zone_sel_districts_data = requests.get("https://api.municode.com/CodesContent?jobId=" + str (jobId)  + "&nodeId=" + str (zone_sel_ord_nodeId) + "&productId=" + str(productId))  
    zone_district_sel_data = response_zone_sel_districts_data.json()

    #Get content of setback info
    zone_setback_content = dict((item['Id'], item) for item in zone_district_sel_data['Docs'] if zoningAbbrSearch in item['Title'].lower())

    for k in zone_setback_content:
        setback_content = zone_setback_content[k]['Content']

    setback_text = []
    soup = bs.BeautifulSoup(setback_content, 'html')
    for strings in soup.stripped_strings:
        s = re.sub("\n", "", strings)
        n = re.sub("\s{2,}", " ", s)
        setback_text.append(n)
    
    doc_raw = ''
    if zone_id == "PRD":
        doc_raw = setback_text[5]
    elif zone_id == "R-1":
        doc_raw = setback_text[7]
    elif zone_id == "REC":
        doc_raw = setback_text[0]
    elif zone_id == "CPD":
        doc_raw = setback_text[3]
    elif zone_id == "M-CD":
        doc_raw = setback_text[3]
    elif zone_id == "PUD":
        doc_raw = setback_text[0]
    else:
        return doc_raw

    nlp = spacy.load("en_core_web_sm")
    doc = nlp(doc_raw)
    options = {"compact": True, "color": "blue"}
    html = displacy.render([doc], style="dep", page=True, options=options)
    return {
             "results":[setback_text, html]
    }
if __name__ =="__main__":
     app.run(host="127.0.0.1", port=500)
