import React, { useEffect } from 'react';
import { FeatureLayer } from 'react-esri-leaflet';

interface LayerDetails {
    featurl: any,
    reference: any,
    parcelcoords?: any,
    parcelinfo?: any
  };
const Layers = (props:LayerDetails) => {

    return (
      <FeatureLayer 
      url = {props.featurl}
      ref = {props.reference}
      style = {(feature) => {
        return {
          fillColor: "null",
          fillOpacity: 0,
          color: "black",
          weight: 0
        }
      }}
      eventHandlers={{
        // loading: () => console.log('featurelayer loading'),
        // load: () => {
        //   console.log('sb featurelayer loaded');
        //   if (props.reference && props.reference.current) {
        //     props.reference.current.metadata((error: any, data: any) => {
        //       console.log('sb featurelayer metadata:', data);
        //       console.log('sb featurelayer error:', error);
        //     });
        //   }
        // },
        click: (e: any) => {
          // console.log(e.layer.feature.properties)
          // var shape = e.layer.feature.getLatLngs()
          // console.log(e.layer._latlngs)
          props.parcelcoords(e.layer._latlngs)
          // console.log(e.layer.feature.properties)
          var parcelinfo = ''
          for (let [key, value] of Object.entries(e.layer.feature.properties)) {
            parcelinfo += `<br>${key}</b>:${value}<br>`
          }
          // console.log(parcelinfo)
          props.parcelinfo(parcelinfo)
          // for(i in e.layer._latlngs) {
          //   var collection = [];
          //   collection.push(e.layer._latlngs[i])
          //   setParcel(collection)
          // }
        }
      }}
      />
    );
  };
  export default Layers;

