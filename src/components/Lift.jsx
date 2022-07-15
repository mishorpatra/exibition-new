import React, { useState, useEffect } from "react";
import { Box, makeStyles, Typography, Badge } from '@material-ui/core'
import { getBuildingData, getRoomsData } from "../services/api";
import { numToString, stringToNum } from "../services/neumericConvert";



const useStyle = makeStyles(theme => ({
    lift: {
        background: '#787878',
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: 60,
        height: 'max-content',
        borderRadius: 5,
        [theme.breakpoints.down('sm')]: {
            width: 40
        }
    },
    floor: {
        width: 60,
        height: 60,
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: 5,
        '&:hover': {
            background: '#555 !important'
        },
        [theme.breakpoints.down('sm')]: {
            width: 40,
            height: 40
        }
    }
}))
let floors
let poly_data
let fdata

const Lift = ({setLevel,
               level, 
               setFloorPlan, 
               venue, 
               building, 
               setRooms, 
               rooms, 
               value,
               check,
               setCheck
            }) => {
    const classes = useStyle()
    const [floor, setFloor] = useState(numToString(value?.data?.floor) || 0)
    

   // console.log(floor, level)

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

  
    
   

    const handleClick = async (e, step) => {
        document.querySelector(`#floor${floor}`).style.background='#787878'
        setFloor(e)
        setLevel(step)
        document.querySelector(`#floor${e}`).style.background='#333'
       
        let response = await getBuildingData(venue.venueName, building, step)
        setFloorPlan(response)
        response = await getRoomsData(venue.venueName, building, step)
        setRooms(response)
    }

    const handleClickFilter = async (e, step) => {
        setCheck(true)
        console.log(e, floor)
        document.querySelector(`#floor${floor}`).style.background='#787878'
        setFloor(e)
        setLevel(step)
        document.querySelector(`#floor${e}`).style.background='#333'
       
        let response = await getBuildingData(venue.venueName, building, step)
        setFloorPlan(response)
        response = await getRoomsData(venue.venueName, building, step)
        setRooms(response)
    }
  

   
 
    return (
        <Box className={classes.lift} >
            {
                 (check || !value?.data) && newFloors && newFloors.map(data => (
                    <Box 
                        title={`${data} floor`}
                        style={{background: data=='ground' && floor==0 ? '#333': '#787878'}} 
                        className={classes.floor} id={`floor${numToString(data)}`} 
                        onClick={() => handleClick(numToString(data), data)}>
                            { value?.data?.floor == data ?
                                <Badge color="secondary" variant="dot"><Typography>L{numToString(data)}</Typography></Badge> :
                                <Typography>L{numToString(data)}</Typography>
                            }
                    </Box>
                ))
            }
            {
                !check && value && value.data && newFloors && newFloors.map(data => (
                    <Box 
                        title={`${data} floor`}
                        style={{background: value.data.floor == data ? '#333': '#787878'}} 
                        className={classes.floor} id={`floor${numToString(data)}`} 
                        onClick={() => handleClickFilter(numToString(data), data)}>
                            { value?.data?.floor == data ?
                                <Badge color="secondary" variant="dot"><Typography>L{numToString(data)}</Typography></Badge> :
                                <Typography>L{numToString(data)}</Typography>
                            }
                    </Box>
                ))
            }
        </Box>
    )
}

export default Lift