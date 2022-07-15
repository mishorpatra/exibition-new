import React, {useEffect, useState} from "react"
import { AppBar, Toolbar, Box, CircularProgress, makeStyles, Typography } from "@material-ui/core"
import { Home, ListAlt, Map, Brightness3, WbSunny } from "@material-ui/icons"
import { useLocation } from "react-router-dom"
import jwt_decode from "jwt-decode"
import { getBuildingData, getGlobalCoords, getRoomsData, getVenues } from "../services/api"
import Details from "./Details"



//components
import GlobalView from "./GlobalView"


const useStyle = makeStyles({
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    options: {
        display: 'flex',
        '&>*': {
            margin: '0 10px'
        }
    },
    component: {
        height: "100vh",
        width: '100vw',
        paddingTop: 71,
        display: 'flex',
        justifyContent: 'center'
    }
})

var venueData
var landmarkData 

const SharedView = ({darkmode, setDarkmode}) => {
    const classes = useStyle()

    const { search } = useLocation()

    function QueryStringToJSON() {            
        var pairs = search.slice(1).split('&');
        
        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
    
        return JSON.parse(JSON.stringify(result));
    }
    
    var query_string = QueryStringToJSON();
    //console.log(query_string)

    const [floorplan, setFloorplan] = useState()
    const [globalCoords, setGlobalCoords] = useState()
    const [landmarks, setLandmarks] = useState()
    const [backdrop, setBackdrop] = useState(false)
    const [floor, setFloor] = useState(query_string.floor)
    const [rooms, setRooms] = useState()
    const [check, setCheck] = useState(false)
    const [listview, setListview] = useState(false)


    useEffect(async () => {
        setBackdrop(true)
         const fetchVenues = async () => {
            let response = await getVenues()
           // console.log(response)
            response.data.map(data => {
                if(data.venueName == query_string.venue) venueData = data
            })
        }
        fetchVenues()
        let response = await getBuildingData(query_string.venue, query_string.building, query_string.floor)
        setFloorplan(response)
        response = await getRoomsData(query_string.venue, query_string.building, query_string.floor)
        setRooms(response)
        getGlobalCoords(query_string.venue, query_string.building, setGlobalCoords, setLandmarks)
        //console.log(response)
        response.map(data => {
            if(data.name == query_string.lmarkName) landmarkData = data
        })
        setBackdrop(false)
    }, [])

    if(!landmarkData || !venueData || !floorplan || !globalCoords) return <CircularProgress color='#27282d' size={23} className={classes.loader} />
    return (
        <Box>
            <AppBar style={{background: darkmode ? '#27282D' : '#fff'}} >
                <Toolbar className={classes.header}>
                    <a href='https://inclunav.apps.iitd.ac.in/exibition-new' title="home button"><Home style={{color: darkmode ? '#fff':'#27282d', cursor: 'pointer'}} /></a>
                    <Typography style={{color: darkmode ? '#fff' : '#27282d'}}>{query_string.lmarkName}, {query_string.building}, {query_string.venue}</Typography>
                    <Box className={classes.options}>
                        <Box title={listview ? 'switch to map view':'switch to list view'}  style={{cursor: 'pointer'}} onClick={() => setListview(!listview)}>{listview ? <ListAlt style={{color: darkmode ? '#fff':'#27282d'}} /> : <Map style={{color: darkmode ? '#fff':'#27282d'}}/>}</Box>
                        <Box title={darkmode ? 'switch to lightmode':'switch to darkmode'} style={{cursor: 'pointer'}} onClick={() => setDarkmode(!darkmode)}>{darkmode ? <Brightness3 /> : <WbSunny style={{color: darkmode ? '#fff':'#27282d'}} />}</Box>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                landmarkData &&
              venueData &&
             floorplan &&
             globalCoords &&
             !listview &&
                <GlobalView 
                venue={venueData}
                building={query_string.building}
                value={{title: landmarkData.name, data: landmarkData}}
                floorplan={floorplan}
                globalCoords={globalCoords}
                floor={floor}
                setFloor={setFloor}
                landmarks={landmarks}
                setBackdrop={setBackdrop}
                rooms={rooms}
                setCheck={setCheck}
                check={check}
                setFloorPlan={setFloorplan}
                setRooms={setRooms}
                darkmode={darkmode}
    />}
        {
            listview &&
            landmarkData &&
            <Box className={classes.component} style={{background: darkmode ? '#222':'#fff'}}>
                <Box style={{width: 'max-content'}}>
                <Details 
                    venue={venueData}
                    lmark={landmarkData} 
                    darkmod={darkmode} 
                    setBackdrop={setBackdrop}
                    lng={query_string.lng}
                    lat={query_string.lat}
                 />
                </Box>
            </Box>
        }
        </Box>
    )
}

export default SharedView