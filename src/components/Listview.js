import React, { useState, useEffect } from 'react'
import { Box, makeStyles, Typography, Dialog, Button } from '@material-ui/core'
import { Email, Phone, Language, RateReview } from '@material-ui/icons'
import { stringToNum } from '../services/neumericConvert'
import axios from 'axios'

//components
import Row from './Row'
import Details from './Details'

const useStyle = makeStyles({
    component: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '95vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'scroll',
        paddingTop: 71
    }
})

let floors
let poly_data
let fdata


const Listview = ({
                    coordinates, 
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
                    setBackdrop
                    }) => {

    const classes = useStyle()
    const [address, setAddress] = useState()
    const [form, setForm] = useState(false)

   
    


    if (rooms) floors = [...new Set(rooms.map(s => s.floor))]
    //extract the floors
    //polygon data or nonwalkables of all floors
    
    if(rooms) poly_data = rooms.slice(rooms.length - floors.length,rooms.length)
    //console.log(poly_data)
    // console.log(floors);
    var newFloors = []
    floors && floors.map((floor, idx) => {
        newFloors.push(stringToNum(idx))
    })
    //console.log(newFloors)
    if(poly_data) fdata=poly_data.map(s=>s.floor)

    //console.log(venue)
    if(value) return (
        <Box className={classes.component} style={{background: darkmode ? '#222':'#fff'}}>
            <Details 
                lmark={value.data} 
                darkmode={darkmode} 
                setBackdrop={setBackdrop} 
                venue={venue}
                building={building}
            />
        </Box>
    )
    return (
        <Box className={classes.component} style={{background: darkmode ? '#222':'#fff'}}>
            {
                newFloors.map(floor_data => (
                    <Row 
                        floor_data={floor_data}
                        darkmode={darkmode}
                        landmarks={landmarks}
                        setBackdrop={setBackdrop}
                        venue={venue}
                        building={building}
                     />
                ))
            }
        </Box>
    )
}

export default Listview