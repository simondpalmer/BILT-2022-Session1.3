
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
          weight: .2
        }
      }}
      eventHandlers={{
        click: (e: any) => {
          console.log(props.parcelcoords)
          if(e.layer._latlngs) {
            props.parcelcoords(e.layer._latlngs)
          }
          console.log(props.parcelcoords)
          var parcelinfo = ''
          for (let [key, value] of Object.entries(e.layer.feature.properties)) {
            parcelinfo += `<br>${key}</b>:${value}<br>`
          }
          props.parcelinfo(parcelinfo)
        }
      }}
      />
    );
  };
  export default Layers;

