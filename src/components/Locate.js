import React, {useEffect, useState} from 'react'
import { Box, makeStyles, Typography } from "@material-ui/core"
import { useParams } from 'react-router-dom'
import { locateUser } from '../services/api'


const useStyle = makeStyles({
    component: {
        height: '100vh',
        width: '100vw'
    },
    mark: {
        width: 20,
        height: 20,
        borderRadius: '50%',
        position: 'absolute',
        background: 'red'
    }
})

const Locate = () => {

    const classes = useStyle()
    const { id } = useParams()
    const [location, setLocation] = useState()

    useEffect(() => {
        const fetchLocation = async () => {
            let response = await locateUser(id)
            //console.log(response)
            setLocation(response)
        }
        fetchLocation()
    })

    return (
        <Box className={classes.component}>
            {location && <Box className={classes.mark} style={{
                top: -1*location.position.y,
                left: location.position.x
            }}></Box>}
            {location && <Typography>{location.position.x}</Typography>}
            {location && <Typography>{location.position.y}</Typography>}
        </Box>
    )
}

export default Locate