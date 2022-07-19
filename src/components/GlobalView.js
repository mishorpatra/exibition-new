import React, {useEffect, useRef, useState} from 'react'
import { Map, TileLayer, Marker, Polygon, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { makeStyles, Box, Typography, Button, Dialog } from '@material-ui/core'
import { Phone, Email, Language, ArrowBack, RateReview, LocationSearching, Apartment, Share, Directions } from '@material-ui/icons'
import useWindowDimensions from '../services/getWindowSize';
import useGeoLocation from '../services/useGeoLocation';
import axios from 'axios'
import { RWebShare } from 'react-web-share';
import { camelToTitle } from '../services/neumericConvert';
import { getBuildingData } from '../services/api';

//components
import Lift from './Lift'
import Rate from './Rating'
import { getLink } from '../services/neumericConvert';

const useStyle = makeStyles(theme => ({
    mapView: {
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      [theme.breakpoints.down('sm')]: {
        height: '95vh'
      }
    },
    formBx: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    input: {
      marginBottom: 10,
      width: 300,
      height: '50%'
    },
    component: {
      flexDirection: 'column'
    },
    lift: {
      position: 'fixed',
      zIndex: 999,
      bottom: '1%',
      right: '1%'
    },
    dialog: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      background: '#fff',
      width: '100%',
    },
    connenct: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10
    },
    option: {
      textDecoration: 'none',
      color: '#000',
      margin: '0 10px',
      cursor: 'pointer'
    },
    form: {
      padding: '20px 25px',
      width: '20vw',
      [theme.breakpoints.down('sm')]: {
        width: '68vw',
        overflow: 'hidden'
      }
    },
    locate: {
      position: 'fixed',
      right: '5%',
      bottom: 30,
      zIndex: 99999,
      borderRadius: '50%',
      minWidth: 45,
      height: 40,
      padding: 0,
      [theme.breakpoints.down('sm')]: {
        bottom: 50,
        right: '12%'
      }
    },
    anote: {
      position: 'absolute', 
      top: '50%', 
      zIndex: 9999,
      color: '#fff'
    }
  }))


const defaultZoom = 18


const pin = new Icon({
  iconUrl: 'https://i.imgur.com/WZV5vzn.gif',
  iconSize: [50, 50]
})
const path = new Icon({
  iconUrl: 'https://img.icons8.com/windows/344/square-full.png',
  iconSize: [25, 25]
})
const parking = new Icon({
  iconUrl: 'https://img.icons8.com/ios/344/parking.png',
  iconSize: [25, 25]
})
const person = new Icon({
  iconUrl: 'https://i.imgur.com/eMkL1sI.png',
  iconSize: [40, 40]
})
const man = new Icon({
  iconUrl: 'https://i.imgur.com/sNkSo2p.png',
  iconSize: [40, 40]
})
const woman = new Icon({
  iconUrl: 'https://i.imgur.com/EGs2yxZ.png',
  iconSize: [40, 40]
})
const lift = new Icon({
  iconUrl: 'https://i.imgur.com/BbAeOzv.png',
  iconSize: [40, 40]
})
const stairs = new Icon({
  iconUrl: 'https://i.imgur.com/xt4Uv3C.png',
  iconSize: [40, 40]
})
const water = new Icon({
  iconUrl: 'https://i.imgur.com/AEEUpIz.png',
  iconSize: [40, 40]
})
const noIcon= new Icon({
  iconUrl: 'https://img.icons8.com/ios-filled/344/drinking-fountain.png',
  iconSize: [0, 0]
})
const beacon = new Icon({
  iconUrl: 'https://i.imgur.com/yRy2aMn.png',
  iconSize: [40, 40]
})
const locateIcon = new Icon({
  iconUrl: 'https://i.imgur.com/HeSTMy6.png',
  iconSize: [25, 25]
})
const select = new Icon({
  iconUrl: 'https://i.imgur.com/g5A339S.gif',
  iconSize: [120, 120]
})

var inx = 0

const GlobalView = ({coordinates, 
                    floorplan, 
                    setFloor, 
                    setFloorPlan, 
                    venue, 
                    building, 
                    setRooms, 
                    rooms, 
                    globalCoords, 
                    floor, 
                    landmarks,
                    value,
                    darkmode,
                    setDarkmode,
                    check,
                    setCheck,
                    setBackdrop,
                    venues, 
                    handleChange, 
                    sortedblist,
                    setVenue }) => {

    const { width } = useWindowDimensions()
    //console.log(darkmode)
    
    const mapRef = useRef();
    const classes = useStyle()
   // console.log(value)

    //rooms && console.log(rooms)
    //console.log(floor)
    //console.log(floorplan)
    //console.log(value)
    globalCoords && globalCoords.map(gc => {
      if(gc.floor === floor) inx = globalCoords.indexOf(gc)
    })
    //landmarks && console.log(landmarks)

    const [open, setOpen] = useState(false)
    const [landmarkData, setLandmarkData] = useState()
    const [zoom, setZoom] = useState(20)
    const [form, setForm] = useState(false)
    const [current, setCurrent] = useState(null)
    const [address, setAddress] = useState()
    const [sharelink, setSharelink] = useState('')
    const [vindex, setVindex] = useState(0)

    const handleLandmark = async (landmark) => {
      setBackdrop(true)
      let response = await axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=${landmark.properties.longitude},${landmark.properties.latitude}`)
      setBackdrop(false)
      //console.log(response.data)
      setAddress(response.data)
      setOpen(true)
      setLandmarkData(landmark)
      let link = getLink(venue, building, landmark)
      setSharelink(link)
      
    }

    const handleZoom = (e) => {
      setZoom(e.zoom)
    }

    const location = useGeoLocation()


    const showMyLocation = () => {
      if (location.loaded && !location.error) {
        if(!current) setCurrent([location.coordinates.lat, location.coordinates.lng])
        else setCurrent(null)
      } else {
        alert(location.error.message);
      }
      }

    const nextVenue = () => {
      if(vindex == venues.data.length-1) setVindex(0)
      else setVindex(vindex+1)
    }
    const prevVenue = () => {
      if(vindex == 0) setVindex(venues.data.length-1)
      else setVindex(vindex-1)
    }

    var buildingLayouts = []
   
    const handleChangeVenue = async (vdata) => {
      handleChange(vdata.data)
      setVenue(vdata.data)
      vdata.data.buildingList.map(async bdata => {
        let response = await getBuildingData(vdata.data.venueName, bdata, 'ground')
        buildingLayouts.push(response)
      })
    }

    return (coordinates && !floorplan && venues && !sortedblist)? (
        <Map ref={mapRef} center={venues.data[vindex].data.coordinates} zoom={defaultZoom} className={classes.mapView} scrollWheelZoom={true} dragging={true} duration={2} zoomControl={false}>
            <TileLayer 
              url={ darkmode ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} 
              attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
              maxZoom={25}
              maxNativeZoom={19}
              />
              
            {
              venues.data.map(vdata => (
                <Marker ref={mapRef} position={vdata.data.coordinates} icon={pin} title={camelToTitle(vdata.data.venueName)} onClick={() => {handleChangeVenue(vdata)}} />
              ))
            }
            <Button variant='contained' className={classes.anote} style={{right: 10, background: '#1fc2ad'}} onClick={() => nextVenue()}>Next </Button>
            <Button variant='contained' className={classes.anote} style={{left: 10, background: '#1fc2ad'}} onClick={() => prevVenue()}>Previous</Button>
        </Map>
    ): (coordinates && !floorplan && venues && sortedblist) ? (
        <Map ref={mapRef} center={venues.data[vindex].data.coordinates} zoom={defaultZoom} className={classes.mapView} scrollWheelZoom={true} dragging={true} duration={2} zoomControl={false}>
              <TileLayer 
                url={ darkmode ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} 
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                maxZoom={25}
                maxNativeZoom={19}
                />
                
              
              <Button variant='contained' className={classes.anote} style={{right: 10, background: "#1fc2ad"}} onClick={() => nextVenue()}>Next </Button>
              <Button variant='contained' className={classes.anote} style={{left: 10, background: '#1fc2ad'}} onClick={() => prevVenue()}>Previous</Button>
          </Map>
    )
    :(coordinates && floorplan && !globalCoords) ? (
      <Map ref={mapRef} 
          center={[
             (parseFloat(floorplan.coordinates[0].globalRef.lat)+parseFloat(floorplan.coordinates[2].globalRef.lat))/2, 
             (parseFloat(floorplan.coordinates[0].globalRef.lng)+parseFloat(floorplan.coordinates[2].globalRef.lng))/2
            ]} 
          zoom={ width<958 ? defaultZoom+1 : defaultZoom+2 } className={classes.mapView} scrollWheelZoom={true} dragging={true} duration={2} zoomControl={false}>

            <TileLayer 
              url={ darkmode ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} 
              attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
              maxZoom={25}
              maxNativeZoom={19}
              />
            
            
            <Polygon color={darkmode ? '#404a40' : '#d3cabf'} opacity={0.1} fillOpacity={1} weight={1} lineCap="round" lineJoin='round' fill="#dad1c8" positions={
              [
                [floorplan.coordinates[0].globalRef.lat, floorplan.coordinates[0].globalRef.lng],
                [floorplan.coordinates[1].globalRef.lat, floorplan.coordinates[1].globalRef.lng],
                [floorplan.coordinates[2].globalRef.lat, floorplan.coordinates[2].globalRef.lng],
                [floorplan.coordinates[3].globalRef.lat, floorplan.coordinates[3].globalRef.lng],
              ]
            } />
            {/*< Polygon color='#000'  opacity={0.7} fillOpacity={0} weight={3} lineCap="round" lineJoin='round'  positions={
             floorplan.parkingCoords.map(parks => {
                return [parks.lat, parks.lon]
              })
            } />
           <Marker ref={mapRef} position={[(parseFloat(floorplan.parkingCoords[0].lat)+parseFloat(floorplan.parkingCoords[2].lat)+parseFloat(floorplan.parkingCoords[1].lat))/3, (parseFloat(floorplan.parkingCoords[0].lon)+parseFloat(floorplan.parkingCoords[2].lon)+parseFloat(floorplan.parkingCoords[1].lon))/3]  } icon={parking} />
           */}
            <Box className={classes.lift}>
              <Lift  setLevel={setFloor} setFloorPlan={setFloorPlan} venue={venue} building={building} setRooms={setRooms} rooms={rooms} />
            </Box>
        </Map>
    ): <Map ref={mapRef} 
            center={current ? [current[0], current[1]] : [
              (parseFloat(floorplan.coordinates[0].globalRef.lat)+parseFloat(floorplan.coordinates[2].globalRef.lat))/2, 
             (parseFloat(floorplan.coordinates[0].globalRef.lng)+parseFloat(floorplan.coordinates[2].globalRef.lng))/2
            ]} 
              zoom={width<958 ? defaultZoom+1 : defaultZoom+2 } className={classes.mapView} scrollWheelZoom={true} dragging={true} duration={2} zoomControl={false} onViewportChange={(e) => handleZoom(e)} >
        <TileLayer 
          url={ darkmode ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} 
          attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
          maxZoom={25}
          maxNativeZoom={19}
          />
         {/*<Polyline color='#000' opacity={1} fillOpacity={1} weight={1} lineCap="round" lineJoin='round' fill='#000' positions={
          globalCoords[0].global[0].map(crd => {
            return [crd[1], crd[0]]
          })
         } />*/}

        
        
        <Polygon color={darkmode ? '#444' : '#d3cabf'} opacity={0.1} fillOpacity={1} weight={1} lineCap="round" lineJoin='round' fill="#dad1c8" positions={
          [
            [parseFloat(floorplan.coordinates[0].globalRef.lat)/*-0.00001*/, floorplan.coordinates[0].globalRef.lng],
            [parseFloat(floorplan.coordinates[1].globalRef.lat), floorplan.coordinates[1].globalRef.lng],
            [parseFloat(floorplan.coordinates[2].globalRef.lat)/*+0.00004*/, floorplan.coordinates[2].globalRef.lng],
            [parseFloat(floorplan.coordinates[3].globalRef.lat)/*+0.00004*/, floorplan.coordinates[3].globalRef.lng],
          ]
        } />
        {/*< Polygon color='#000'  opacity={0.7} fillOpacity={0} weight={3} lineCap="round" lineJoin='round'  positions={
        floorplan.parkingCoords.map(parks => {
            return [parks.lat, parks.lon]
          })
        } />
        <Marker ref={mapRef} position={[(parseFloat(floorplan.parkingCoords[0].lat)+parseFloat(floorplan.parkingCoords[2].lat)+parseFloat(floorplan.parkingCoords[1].lat))/3, (parseFloat(floorplan.parkingCoords[0].lon)+parseFloat(floorplan.parkingCoords[2].lon)+parseFloat(floorplan.parkingCoords[1].lon))/3]  } icon={parking} />*/}
         {
            globalCoords[inx].global.map(glb_crd => (
              <Polyline color='#000' opacity={1} weight={3} lineCap='round' lineJoin='round'  positions={
                glb_crd.map(latlng => {
                  return [latlng[1], latlng[0]]
                })

              }  />
            ))
         }
        
      
      {
         landmarks && zoom>19 && landmarks.map(landmark => (
          landmark.properties.latitude && landmark.floor === floor && landmark.name && <Marker ref={mapRef} position={[landmark.properties.latitude, landmark.properties.longitude]}  title={landmark.name} onclick={() => handleLandmark(landmark)} icon={
            landmarkData?.name == landmark.name ? noIcon :
            landmark.element.type=='Rooms' && (!value || value.title === 'Rooms') ? person :
            landmark.element.subType=='lift' && (!value ||  value.title === 'lift') ? lift :
            landmark.element.subType == 'stairs' && (!value || value.title === 'stairs') ? stairs :
            landmark.properties.washroomType=='Female' && (!value || value.title === 'restRoom') ? woman :
            landmark.element.subType == 'drinkingWater' && (!value || value.title === "drinkingWater") ? water :
            landmark.properties.washroomType=='Male' && (!value || value.title === 'restRoom') ? man : 
            landmark.element.subType == 'beacons' && zoom>22 ? beacon : 
            value && value.title == landmark.name ? person :
            noIcon
          } />

        ))
      }

          {location.loaded && !location.error && (
                <Marker
                  title='My location'
                  icon={locateIcon}
                  position={[
                    location.coordinates.lat,
                    location.coordinates.lng,
                  ]}
                ></Marker>
          )}

          {
            landmarkData &&
            open &&
            <Marker
              title={landmarkData.name}
              icon={select}
              position={[
                landmarkData.properties.latitude,
                landmarkData.properties.longitude
              ]}
              />
          }
     

        <Box className={classes.lift} style={{bottom: open? '16%': '1%'}}>
          <Lift  
            setLevel={setFloor} 
            level={floor} 
            setFloorPlan={setFloorPlan} 
            venue={venue} 
            building={building} 
            setRooms={setRooms} 
            rooms={rooms} 
            value={value}
            check={check}
            setCheck={setCheck}
            setLandmarkData={setLandmarkData}
            />
        </Box>
        <Box className={classes.dialog} style={{display: open ? 'block' : 'none', background: darkmode ? '#27282d' : '#eee'}}>
          <Box style={{position: 'absolute', top: '5%', left: '1%', cursor: 'pointer'}} onClick={() => setOpen(false)}><ArrowBack style={{color: darkmode ? '#fff' : '#222'}} /></Box>
            {landmarkData && 
            <Box >
              <Typography style={{ fontSize: 17, fontWeight: 600, color: darkmode ? '#fff' : '#222'}}>{landmarkData.name}</Typography>
              <Typography style={{color: darkmode ? '#fff': '#222', marginBottom: 10, padding: '0 10px'}}>{building} building, {landmarkData.floor} floor, {address.address.Match_addr}</Typography>
              <Box className={classes.connect}>
                <a className={classes.option}><Directions style={{fontSize: 40}} /></a>
                {landmarkData.properties.contactNo && <a href={`tel:${landmarkData.properties.contactNo}`} title='make a call' className={classes.option}><Phone /></a>}
                {landmarkData.properties.email && <a href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${landmarkData.properties.email}`} target="_blank" title='send an email' className={classes.option}><Email /></a>}
                {landmarkData.properties.url && <a href={`${landmarkData.properties.url}`} target='_blank' title={`go to ${landmarkData.name} website`} className={classes.option}><Language /></a>}
                <a className={classes.option} title='give a feedback' onClick={() => setForm(true)} ><RateReview /></a>
                <RWebShare
                  data={{
                    text: "Inclunav indoor navigation system",
                    url: sharelink,
                    title: `Share the location of ${landmarkData.name}`,
                  }}
                  onClick={() => console.log("shared successfully!")}
                >
                  <a className={classes.option}><Share /></a>
                </RWebShare>
              </Box>
              {landmarkData.properties.timings && <Typography>{landmarkData.properties.timings}</Typography>}
            </Box>}
        </Box>
        <Dialog open={form} onClose={() => setForm(false)} >
        <Box className={classes.form}>
                <Typography style={{fontWeight: 600, fontSize: 18, marginLeft: 10}}>Add a Review</Typography>
                <textarea placeholder='Write something here...'  style={{resize: 'none', width: '90%', height: '15vh', borderRadius: 10, padding: '8px 10px', marginTop: 10}}  ></textarea><br />
                <Rate />
                <Button variant='contained' style={{background: 'green', color: '#fff'}} onClick={() => setForm(false)}>Submit</Button>
              </Box>
        </Dialog>
        {location && <Button variant='contained' onClick={() => showMyLocation()} className={classes.locate} title={!current ? 'switch to my location' : 'switch to building location'} style={{background: '#222', bottom: open ? '16%':30}} >
          {!current ? <LocationSearching style={{color: '#fff'}} /> : <Apartment style={{color: '#fff'}} />}
        </Button>}
    </Map>
}

export default GlobalView