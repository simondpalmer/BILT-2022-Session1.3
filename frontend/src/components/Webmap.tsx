import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, useMapEvents, Polygon} from 'react-leaflet';
import { BasemapLayer } from 'react-esri-leaflet';

import { LatLngTuple } from 'leaflet';

import Layers from './Layers';


const defaultLatLng: LatLngTuple = [34.389835, -119.513683];
const zoom:number = 30;
const sbcParcelsFeatureLayerURL:string = "https://services8.arcgis.com/s7n9cRiugyMCsR0U/arcgis/rest/services/Parcel_layers_ArcGISonline_LUZO/FeatureServer/0";
const carpfeatureLayerURL:string = "https://services3.arcgis.com/4RhjucfEdH2OTG7M/arcgis/rest/services/carp_zoning_and_landuse_2016/FeatureServer/1";
interface Props {
  details: any
  parcel: any
  parcelname: any
};

const Webmap: React.FC<Props> = (props) => {
  
  const [ hidePolygon, setHidePolygon ] = useState<boolean>(false);
  const [ parcelLatLng, setParcelLatLng ] = useState<any>({lat: 34.390021, lng: -119.513522});
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

             if (bounds.contains(clickBounds) && feature.feature !== undefined) {
              intersectingFeatures.push([feature.feature.properties]);
             }
           }
         }
       }
       //List fields to export
       var fields: string[] = ["ZONING", "ZonDescrip", "ZONE", "Zone_Descr", "ZONEDIST"]
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
              html += `<br><b>${key}</b>:${value}<br>`
            }
          }
          console.log(output)
          console.log(html)
          const zoneDetailRe = /(?<=<\/b>:).+?(?=<br>)/
          const zoneDetails = zoneDetailRe.exec(html)
          if (zoneDetails) {
            props.details(zoneDetails[0])
          }
          //setParcelData(html)
         
    }}
  });
  return null;
};

const updateParcelCoords = (parcel: any) => {
  setParcel(parcel);
  setHidePolygon(true)
}

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