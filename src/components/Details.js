import React, {useState} from 'react'
import { Collapse, makeStyles, Typography, Box, Dialog, Button } from '@material-ui/core'
import { Phone, Language, Email, RateReview, Share } from '@material-ui/icons'
import axios from 'axios'
import { RWebShare } from 'react-web-share';
import { getLink } from '../services/neumericConvert';

//components
import Rate from './Rating'


const useStyle = makeStyles(theme => ({
    lmark: {
        textAlign: 'center',
        background: '#2fc8ad',
        opacity: 0.9,
        marginBottom: 7,
        padding: '10px 12px',
        borderRadius: 8,
        cursor: 'pointer'
    },
    details: {
        background: '#2fc8ad',
        padding: '10px 12px',
        borderRadius: 8
    },
    connenct: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: '100%'
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
}))


const Details = ({
                    lmark, 
                    darkmode,
                    setBackdrop,
                    venue,
                    building,
                    lat,
                    lng
                }) => {

    const [open, setOpen] = useState(false)
    const [address, setAddress] = useState()
    const classes = useStyle()
    const [form, setForm] = useState(false)
    const [sharelink, setSharelink] = useState('')

    //console.log(lmark)

    const handleClick = async () => {
        setBackdrop(true)
        let response = await axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&langCode=EN&location=${lmark.properties.longitude || lng},${lmark.properties.latitude || lat}`)
        setBackdrop(false)
        setOpen(!open)
        setAddress(response.data)
        //console.log(venue, building, lmark)
        let link = getLink(venue, building, lmark)
        setSharelink(link)
    }

    return (
        <>
            <Typography className={classes.lmark} style={{color: darkmode ? '#222':'#fff', cursor: 'pointer'}} onClick={() => handleClick()}>{lmark.name}</Typography>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1} className={classes.details}>
                    <Typography style={{color: darkmode ? '#222':'#fff'}}>{building} building, {lmark.floor} floor, {address?.address.Match_addr}</Typography>
                    <Box className={classes.connect} className='connections'>
                        {lmark.properties.contactNo && <a href={`tel:${lmark.properties.contactNo}`} title='make a call' className={classes.option}><Phone /></a>}
                        {lmark.properties.email && <a href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${lmark.properties.email}`} target="_blank" title='send an email' className={classes.option}><Email /></a>}
                        {lmark.properties.url && <a href={`${lmark.properties.url}`} target='_blank' title='go to there website' className={classes.option}><Language /></a>}
                        <a className={classes.option} title='give a feedback' onClick={() => setForm(true)} ><RateReview /></a>
                        <RWebShare
                            data={{
                                text: "Inclunav indoor navigation system",
                                url: sharelink,
                                title: `Share the location of ${lmark.name}`,
                            }}
                            onClick={() => console.log("shared successfully!")}
                            >
                            <a className={classes.option}><Share /></a>
                            </RWebShare>
                    </Box>
                  {lmark.properties.timings && <Typography>{lmark.properties.timings}</Typography>}
                </Box>
                <Dialog open={form} onClose={() => setForm(false)} >
                    <Box className={classes.form}>
                    <Typography style={{fontWeight: 600, fontSize: 18, marginLeft: 10}}>Add a Review</Typography>
                    <textarea placeholder='Write something here...'  style={{resize: 'none', width: '90%', height: '15vh', borderRadius: 10, padding: '8px 10px', marginTop: 10}}  ></textarea><br />
                    <Rate />
                    <Button variant='contained' style={{background: 'green', color: '#fff'}} onClick={() => setForm(false)}>Submit</Button>
                    </Box>
                </Dialog>
            </Collapse>
        </>
    )
}

export default Details