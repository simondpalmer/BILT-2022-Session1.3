import React, { useEffect, useContext, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup, LayersControl, useMapEvents, Polygon} from 'react-leaflet';
import {
	BasemapLayer,
  FeatureLayer,
} from 'react-esri-leaflet';
import VectorTileLayer from 'react-esri-leaflet/plugins/VectorTileLayer';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import * as GeoSearch from 'leaflet-geosearch';
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";
import {LatLng, LatLngExpression, LatLngTuple } from 'leaflet';
import { ViewAgenda } from '@mui/icons-material';
import { Input } from '@mui/material';
import Layers from './Layers';


const defaultLatLng: LatLngTuple = [34.399383, -119.518434];
const zoom:number = 20;
const sbcParcelsFeatureLayerURL:string = "https://services8.arcgis.com/s7n9cRiugyMCsR0U/arcgis/rest/services/Parcel_layers_ArcGISonline_LUZO/FeatureServer/0";
const carpfeatureLayerURL:string = "https://services3.arcgis.com/4RhjucfEdH2OTG7M/arcgis/rest/services/carp_zoning_and_landuse_2016/FeatureServer/1";


  const openProvider = new OpenStreetMapProvider();
  const mapStyle = "bar";
interface Props {
  details: any
  parcel: any
  parcelname: any
};

const Webmap: React.FC<Props> = (props) => {
  
  const [ parcelAddr, setParcelAddr ] = useState<any>();
  const [ hidePolygon, setHidePolygon ] = useState<boolean>(false);
  const [ parcelLatLng, setParcelLatLng ] = useState<any>({lat: 34.392522, lng: -119.512952});
  const [ parcel, setParcel ] = useState<any>([
    [
        {
            "lat": 34.418248,
            "lng": -119.696385
        },
        {
            "lat": 34.417875,
            "lng": -119.696781
        },
        {
            "lat": 34.418133,
            "lng": -119.697131
        },
        {
            "lat": 34.418504,
            "lng": -119.696733
        }
    ]
])
  //const { point } = useContext(LayerContext);
  const featureLayerRef: any = useRef();

  useEffect(() => {
    console.log(parcelAddr)
  },[parcelAddr])

  useEffect(() => {
    console.log(parcelLatLng)
  },[parcelLatLng])

 const MapEvents = () => {
  const map = useMapEvents({
    click: (e) => {
      console.log(e.target)
       var clickBounds = e.latlng;
       var intersectingFeatures = []
       for (var i in e.target._layers) {
         var overlay = e.target._layers[i]
         if (overlay._layers) {
           for (var f in overlay._layers) {
              var feature = overlay._layers[f];
             var bounds;
             if (feature.getBounds) bounds = feature.getBounds();
            //  else if (feature._latlng) {
            //   bounds = e.target.latLngBounds(feature._latlng, feature._latlng);
            // }
             if (bounds.contains(clickBounds) && feature.feature != undefined) {
              intersectingFeatures.push([feature.feature.properties]);
             }
           }
         }
       }
       //List fields to export
       var fields: string[] = ["ZONING", "ZonDescrip", "ZONE", "Zone_Descr", "LUCode_Concept", "LUDesign_Concept", "ZONEDIST", "LAND_USE"]
       //"APN", "Situs1", "Acreage",
       var html = ''
         if(intersectingFeatures.length) {
           var output =  intersectingFeatures.map(([obj]) => [ Object.fromEntries(
           Object.entries(obj)
           .filter(([key]) => fields.includes(key))
         )])
         .filter(([obj]) => Object.keys(obj).length)
          for(var t=0; t<output.length; t++ ) {
            for(let [key, value] of Object.entries (output[t][0])) {
              html += `<br>${key}</b>:${value}<br>`
            }
          }
          console.log(output)
          console.log(html)
          props.details(html)
          //setParcelData(html)
         
    }}
  });
  return null;
};

const updateParcelCoords = (parcel: any) => {
  setParcel(parcel);
  setHidePolygon(true)
}
//TODO
//update Parcel data based on Search results
//results.label = address
//result.x = lat
//result.y = long
//
//use these or Marker event location to:
//plot polygon dimensions
//retrieve layers info
//all to be passed as props to the App.tsx for ParcelDetails.tsx

  return (
    <MapContainer id="mapid" center={defaultLatLng} zoom={zoom} dragging= {false} scrollWheelZoom={false} zoomControl={false}>
      <MapEvents />
      <BasemapLayer name="Gray" />
      <Layers 
      featurl={sbcParcelsFeatureLayerURL}
      reference={featureLayerRef}
      parcelcoords={updateParcelCoords}
      parcelinfo={props.parcel}
      />
      <Layers
        featurl={carpfeatureLayerURL}
        reference={featureLayerRef}
      />
      {hidePolygon && <Polygon positions={parcel[0].map((o: any) => ({lat: o.lat, lng: o.lng}))} />}
    </MapContainer>
  )
};

export default Webmap;