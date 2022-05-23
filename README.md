# BILT-2022-Session1.3 - GIS, NLP and BIM

Demo of a web service for the public & AEC professionals to visualize regulatory code as it relates to a given property 

- [Concept](#concept)
- [Dependancies](#dependancies)
- [Installation](#installation)
- [UI Images](#ui-images)
- [Future Development](#future-development)
- [Key Contributors](#key-contributors)

---

## Concept

Find relevant regulatory code pertaining to a given property. This app focuses only on the Carpenteria, CA area and allows the user to click on any parcel and retrieve relevant setback information to be used within BIM via a Dynamo graph.

## Dependancies

This repository makes use of the following:

- The platform [react](https://reactjs.org/) for the frontend
- For the map to select the property and retrieve the layers of rich information this uses [ArcGIS](https://www.arcgis.com/index.html)
- The use of [spaCy](https://spacy.io/) for its industrial strength NLP processing
- And last but not least, [flask](https://flask.palletsprojects.com/en/2.1.x/) which the api is built on

### Installation

1. run `yarn start`
2. Development server will start

#### UI Images

## Future Development

Looking to expand this to include other county's and cities. If you are interested in contributing let me know! 

## Key Contributors

- [Simon Palmer - @simondpalmer](https://github.com/simondpalmer)
