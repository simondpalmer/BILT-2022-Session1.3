import React, { useEffect, useState } from 'react';
import '../css/App.css';
import Webmap from './Webmap';
import Header from './Header';
import { ParcelDetails } from './ParcelDetails';
import { SetbackDetails } from './SetbackDetails';
import { Container, Stack } from '@mui/material';
import Button from '@mui/material/Button';

interface Props {}

const App:React.FC = (props: Props) => {
  //const [apikey, setApikey] = useState(process.env.ARCGIS_API_KEY);
  const [featCollect, setFeatCollect] = useState<any>("Zoning Info")
  const [parcelCollect, setParcelCollect] = useState<any>("Parcel Info")
  const [addrCollect, setAddrCollect] = useState<any>("PROPERTY INFO")
  const [constraints, setConstraints] = useState<any>([])
  const [dependancies, setDependancies] = useState<any>("")
  const [viewPropertyInfo, setViewPropertyInfo ] = useState<boolean>(false);
  const [viewSetbackInfo, setSetbackInfo ] = useState<boolean>(false);
  const [viewSpinner, setViewSpinner ] = useState<boolean>(false);

  const handleReportSubmit = (e:any) => {
    e.preventDefault();
    setViewSpinner(true);
    fetch(`/api/new-report?query=${featCollect}`)
    .then((res) => res.json())
    .then((data) => {
      setViewSpinner(false)
      console.log(data.results)
      setConstraints(data.results[0])
      setDependancies(data.results[1])
      setSetbackInfo(true)
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const updateZoning = (zoning: any) => {
    setFeatCollect(zoning)
  }
  
  const updateParcel = (parcel: any) => {
    setParcelCollect(parcel)
    setViewPropertyInfo(true)
  }

  const updateAddress = (adress: any) => {
    setAddrCollect(adress)
  }

  useEffect(() => {
    console.log(featCollect)
  }, [featCollect])

  useEffect(() => {
    console.log(constraints)
  }, [constraints])

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Header />
        <Stack spacing={5} padding={1}>
          <Webmap parcelname={updateAddress} details={updateZoning} parcel={updateParcel}/>
          {viewPropertyInfo && <Button variant="outlined" onClick={handleReportSubmit}>Generate Report</Button>}
          {viewSpinner && <h3>Loading....</h3>}
          {!viewSpinner && viewSetbackInfo && <h3>Scroll to the bottom for the Report!</h3>}
          {!viewPropertyInfo && <h3>Click on a property to display property information. Once done click on "Generate Report"!</h3>}
          {viewPropertyInfo && <ParcelDetails parcelname={addrCollect} details={featCollect} parcel={parcelCollect}/>}
          {viewSetbackInfo && <SetbackDetails setbacks={constraints} dep_map={dependancies}/>}
        </Stack>
      </Container>
    </React.Fragment> 
  );
}

export default App;
