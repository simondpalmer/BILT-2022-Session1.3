import React, { useEffect, useState } from 'react';
import '../css/App.css';
import Webmap from './Webmap';
import Header from './Header';
import { ParcelDetails } from './ParcelDetails';
import { Container, Box, Stack } from '@mui/material';
import Grid from "@material-ui/core";
import { Layout } from './Layout';

const API_URL = process.env.API_URL || 'http://127.0.0.1:3000'

interface Props {}

const App:React.FC = (props: Props) => {
  //const [apikey, setApikey] = useState(process.env.ARCGIS_API_KEY);
  const [featCollect, setFeatCollect] = useState<any>("Zoning Info")
  const [parcelCollect, setParcelCollect] = useState<any>("Parcel Info")
  const [addrCollect, setAddrCollect] = useState<any>("Address")
  const [constraints, setConstraints] = useState<any>([])
  const [featCollected, setFeatCollected] = useState<number>(0)

  const handleReportSubmit = (e:any) => {
    e.preventDefault();
    fetch('${API_URL}/new-report?query=${address}')
    .then((res) => res.json())
    .then((data) => {
      setConstraints([{address: constraints }])
    })
    .catch((err) => {
      console.log(err);
    })
  }

  // useEffect(() => {
  //   fetch('/new-report').then(
  //     response => response.json()
  //   ).then(data => setContraints(data))
  // }, [featCollect])

  const updateZoning = (zoning: any) => {
    setFeatCollect(zoning)
  }
  
  const updateParcel = (parcel: any) => {
    setParcelCollect(parcel)
  }

  const updateAddress = (adress: any) => {
    setAddrCollect(adress)
  }

  useEffect(() => {
    console.log(featCollect)
  }, [featCollect])

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <Header />
        <Stack spacing={5} padding={1}>
          <Webmap parcelname={updateAddress} details={updateZoning} parcel={updateParcel}/>
          <ParcelDetails parcelname={addrCollect} details={featCollect} parcel={parcelCollect} />
        </Stack>
      </Container>
    </React.Fragment> 
  );
}

export default App;
