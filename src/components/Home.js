import React, {useState, useEffect} from 'react'
import { Box, makeStyles, Typography, AppBar, Toolbar, TextField, Dialog, Button, CircularProgress, Backdrop } from '@material-ui/core'
import { ArrowBack, ExitToApp, Settings, ListAlt, Map, Brightness3, WbSunny, LocationSearching, DirectionsWalk } from '@material-ui/icons'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {  getVenues, getRoomsData, getBuildingData, getGlobalCoords, getDevice } from '../services/api';
import useWindowDimentions from '../services/getWindowSize'
import { useNavigate } from 'react-router-dom';
import { camelToTitle, findDistance, walkTime } from '../services/neumericConvert';
import useGeoLocation from '../services/useGeoLocation';

//components
import GlobalView from './GlobalView';
import Listview from './Listview';

const useStyles = makeStyles((theme) => ({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    component: {
        height: '100vh',
        width: '100vw',
    },
    formControl: {
        minWidth: 150
    },
    container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        zIndex: 999,
        wrap: 'wrap',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },
    inputBx: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column'
        }
    },
    tag: {
        position: 'fixed',
        top: '3%',
        left: '22vw',
        color: '#000',
        textAlign: 'center',
        zIndex: -1,
        [theme.breakpoints.down('md')]: {
            left: '22vw'
        },
        [theme.breakpoints.down('sm')]: {
            left: '0',
            top: '2.7%',
            width: '100%',
        }
    },
    search: {
        background: '#fff',
        borderRadius: 6,
    },
    navBar: {
        background: '#27282D', 
        transition: 0.5,
        height: 'max-content',
        padding: 0,
        margin: 0,
    },
    arrows: {
        cursor: 'pointer',
    },
    logout: {
        position: 'fixed',
        right: '2%',
        top: '10%',
        cursor: 'pointer'
    },
    dialog: {
        padding: '25px 35px',
        background: '#27282d',
        borderRadius: 8
    },
    DActions: {
        marginTop: 40,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
    container: {
      background: '#222',
      height: '93%',
      width: '100%',
      marginTop: 64,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        marginTop: 56,
        height: '93.5%'
     },
      '&>*': {
          color: '#000',
          height: 60,
          width: 250,
          marginTop: 10,
          borderRadius: 8,
          fontSize: 16,
          textTransform: 'capitalize'
      },
    },
    toolbar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    searchBx: {
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            width: '70%'
        }
    },
    imgBx: {
        height: 80,
        width: 80,
        borderRadius: '50%'
    },
    profile: {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    detail: {
        margin: 0
    },
    autoselect: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: 8,
        border: '1px solid #2fc2ad',
        '&>*': {
            margin: '0 2px',
        }
    },
    venueBtn: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        '&>*': {
            margin: '0 10px',
        }
    },
    travel: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
  }));

const initialCords = [ 28.644800, 77.216721]
const filter = createFilterOptions()
const Home = ({ darkmode, setDarkmode }) => {

    const navigate = useNavigate()
    const location = useGeoLocation()


   /* useEffect(() => {
        setUser(JSON.parse(window.sessionStorage.getItem("user")));
      }, []);*/
//const navigate = useNavigate()

   //console.log(localStorage)
   if(!localStorage.user || localStorage.user == 'undefined') navigate('/signin')

    const { width } = useWindowDimentions()
    //console.log(darkmode)
    
    

    const classes = useStyles();
    const [venue, setVenue] = useState('');
    const [openVenue, setOpenVenue] = useState(true);
    const [openBuilding, setOpenBuilding] = useState(true)
    const [venues, setVenues] = useState()
    const [building, setBuilding] = useState()
    const [coordinates, setCoordinates] = useState(initialCords)
    const [floorplan, setFloorPlan] = useState()
    const [value, setValue] = useState()
    const [floor, setFloor] = useState('ground')
    const [rooms, setRooms] = useState()
    const [globalCoords, setGlobalCoords] = useState()
    const [landmarks, setLandmarks] = useState()
    const [open, setOpen] = useState(false)
    const [backdrop, setBackdrop] = useState(false)
    const [device, setDevice] = useState()
    const [openSettings, setOpenSettings] = useState(false)
    const [check, setCheck] = useState(false)
    const [listview, setListview] = useState(false)
    const [sortedblist, setSortedblist] = useState()
    
    useEffect(() => {
        const fetchVenues = async () => {
            setBackdrop(true)
            let response = await getVenues()
            if(!location.loaded || location.error) {
                return response
            }
            //console.log(response)
            var arr = []
            response.data.map(data => {
                var distance = findDistance(data.coordinates[0], data.coordinates[1],location.coordinates.lat, location.coordinates.lng)
                arr.push({
                    data: data,
                    distance: distance
                })
            })
        arr.sort((a, b) => {
            return a.distance - b.distance
        })
        setVenues({data: arr})
        }
        fetchVenues()
        setBackdrop(false)

    }, [coordinates, location])

  /*  useEffect(() => {
        const fetchDevice = async () => {
            let customer_id = JSON.parse(localStorage.user).data.id
            let response = await getDevice(customer_id)
            setDevice(response)
        }
        fetchDevice()
    }, [])
    */
    /*const fetchBuildings = async (venue_name) => {
        console.log(venue_name)
        let response = await getBuildings(venue_name)
        console.log(response)
    }*/

    const handleChange = (event) => {
        console.log(event)
        setVenue(event)
        setOpenBuilding(true)
        if(event.coordinates) setCoordinates([event.coordinates[0], event.coordinates[1]])
        setFloorPlan(null)
       // await fetchBuildings(event.target.value.venueName)

       var arr = []
       event.buildingList.map(async (bname, idx) => {
           let response = await getBuildingData(event.venueName, bname, floor)
           var lat = 0
           var lng = 0
           response.coordinates.map(crds => {
               lat += parseFloat(crds.globalRef.lat)
               lng += parseFloat(crds.globalRef.lng)
           })
           lat = lat/4
           lng = lng/4

           var distance = findDistance(lat, lng, location.coordinates.lat, location.coordinates.lng)
           arr.push({
               buildingName: bname,
               distance: distance
           })
           if(idx == event.buildingList.length-1) {
              arr.sort((a,b) => {
               return a.distance - b.distance
              })
              setSortedblist(arr)
              //await handleChangeBuilding(arr[0].buildingName)
           }
       })
    };
    const handleChangeBuilding = async (event) => {
        setBackdrop(true)
        setBuilding(event)
        setFloor('ground')
        setValue()
        console.log(venues)
        let response = await getBuildingData(venue.venueName || venues.data[0].data.venueName, event, floor)
        //console.log(response)
        setFloorPlan(response)
        response = await getRoomsData(venue.venueName || venues.data[0].data.venueName, event, floor)
        setRooms(response)
        getGlobalCoords(venue.venueName || venues.data[0].data.venueName, event, setGlobalCoords, setLandmarks)
        setBackdrop(false)
    }

    

    const handleCloseVenue = () => {
        setOpenVenue(false);
    };

    const handleOpenVenue = () => {
        setOpenVenue(true);
    };

    const handleCloseBuilding = () => {
        setOpenBuilding(false)
    }

    const handleOpenBuilding = () => {
        setOpenBuilding(true)
    }

    const handleNavBar = () => {
        const navBar = document.querySelector('#nav_bar').style
        navBar.display = navBar.display == 'none' ? 'block' : 'none' 
    }
    const handleBack = () => {
        if(openSettings) setOpenSettings(false)
        else {
            if(building) setBuilding(null)
            if(!building && venue) setVenue('')
        }
    }

   const handleLogout = () => {
        localStorage.clear()
        navigate('/signin')
    }

    const handleSettings = () => {
        setOpenSettings(true)
    }

   
   const autoselect = async () => {
        if(location.error) {
            alert('Please enable the location access')
            return
        }
        setBackdrop(true)
        setVenue(venues.data[0].data)
        var arr = []
        venues.data[0].data.buildingList.map(async (bname, idx) => {
            let response = await getBuildingData(venues.data[0].data.venueName, bname, floor)
            var lat = 0
            var lng = 0
            response.coordinates.map(crds => {
                lat += parseFloat(crds.globalRef.lat)
                lng += parseFloat(crds.globalRef.lng)
            })
            lat = lat/4
            lng = lng/4

            var distance = findDistance(lat, lng, location.coordinates.lat, location.coordinates.lng)
            arr.push({
                buildingName: bname,
                distance: distance
            })
            if(idx == venues.data[0].data.buildingList.length-1) {
               arr.sort((a,b) => {
                return a.distance - b.distance
               })
               setSortedblist(arr)
               await handleChangeBuilding(arr[0].buildingName)
            }
        })
        setBackdrop(false)
        
        //setBuilding(arr[0].buildingName)
   }

    //landmarks && console.log(landmarks)
    var blocks = [
        {title: 'Help Desk | Reception'},
        {title: 'Rooms'},
        {title: 'Security Room'},
        {title: 'Information Center'},
        {title: 'Transportation Service Till Building'},
        {title: 'lift'},
        {title: 'ramp'},
        {title: 'escalator'},
        {title: 'stairs'},
        {title: 'drinkingWater'},
        {title: 'kiosk'},
        {title: 'restRoom'},
        {title: 'Medical Room'},
        {title: 'Break Room'},
        {title: 'Change Room'},
        {title: 'Clock Room'},
        {title: 'Child | Baby Care'},
        {title: 'Food and Drinks'},
        {title: 'Trash Cans | Dustbin'}
     ]
    landmarks && landmarks.map(lmark => {
        if(lmark.element.type == 'Rooms') {
            blocks.push({
                title: lmark.name,
                data: lmark
            })
        }
    })

    return !venues ? <CircularProgress color='#787878' size={25} style={{
        position: 'absolute',
        top: '48%',
        left: '48%'
    }} /> :
     (
        <Box className={classes.component}>
         
            <AppBar className={classes.navBar} id='nav_bar' style={{background: darkmode ? '#27282d' : '#fff'}} >
                <Toolbar className={classes.Toolbar} >
                <Box title='back button'><ArrowBack  onClick={() => handleBack()} title='back' className={classes.arrows} style={{color: darkmode ? '#fff' : '#222'}}/></Box>
                {!venue && !openSettings && <Typography style={{width: '100%', color: darkmode ? '#fff' : '#222'}}>Select Venue</Typography>}
                {venue && !building && !openSettings && <Typography style={{width: '100%', color: darkmode ? '#fff' : '#222'}}>Select Building</Typography>}
                {openSettings && <Typography style={{width: '100%', color: darkmode ? '#fff' : '#222'}} >Settings</Typography>}
                {
                    venue && 
                    building && 
                    !openSettings &&
                    <Box className={classes.searchBx} >
                    <Autocomplete
                        value={value}
                        onChange={async (event, newValue) => {
                            if (typeof newValue === 'string') {
                            setValue({
                                title: newValue,
                            });
                            } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setValue({
                                title: newValue.inputValue,
                            });
                            } else {
                            setValue(newValue);
                            }
                           /* if(newValue.data) {
                                let response = await getBuildingData(venue.venueName, building, newValue.data.floor)
                                console.log(response)
                                setFloorPlan(response)
                            }*/
                            if(newValue?.data) {
                                setFloor(newValue.data.floor)
                                setCheck(false)
                            }
                        }}
                        filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            // Suggest the creation of a new value
                            if (params.inputValue !== '') {
                            filtered.push({
                                inputValue: params.inputValue,
                                title: `Add "${params.inputValue}"`,
                            });
                            }

                            return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={blocks}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                            return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                            return option.inputValue;
                            }
                            // Regular option
                            return option.title;
                        }}
                        renderOption={(option) => option.title}
                        style={{ width: 300, color: '#fff' }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Search for rooms, offices etc..." variant='outlined'  className={classes.search} style={{color: '#fff'}} />
                        )}
                    /></Box>}
                    <Box style={{display: 'flex'}}>
                        {venue && building && <Box title={!listview ? 'switch to list view':'switch to map view'}>{ listview ? <ListAlt onClick={() => setListview(!listview)} className={classes.arrows} style={{marginLeft: 10, cursor: 'pointer', color: darkmode ? '#fff' : '#222'}} />:<Map onClick={() => setListview(!listview)} className={classes.arrows} style={{marginLeft: 10, cursor: 'pointer', color: darkmode ? '#fff' : '#222'}} /> }</Box>}
                        {!openSettings && <Box title='settings'><Settings className={classes.arrows} style={{marginLeft: 10, cursor: 'pointer', color: darkmode ? '#fff' : '#222'}} title='settings' onClick={() => handleSettings()} /></Box>}
                    </Box>
            </Toolbar>
            </AppBar>
            {
                venues &&
                !venue && 
                !openSettings &&
                <Box className={classes.container} style={{background: !darkmode ? '#efefef' : '#222'}}>
                        {
                            venues.data.map(venueData => (
                                !venueData.data ? <Button style={{background: '#2fc8ad', color: !darkmode ? '#efefef' : '#222'}}  onClick={() => handleChange(venueData)} title={venueData.venueName} >{camelToTitle(venueData.venueName)}</Button>:
                                <Button style={{background: '#2fc8ad', color: !darkmode ? '#efefef' : '#222',}} className={classes.venueBtn} onClick={() => handleChange(venueData.data)} title={venueData.data.venueName} >
                                    <Typography>{camelToTitle(venueData.data.venueName)}</Typography>
                                    <Box className={classes.travel} title={`by walk ${walkTime(venueData.distance)}`}>
                                        <Typography style={{textTransform: 'lowercase'}}>{venueData.distance<1 ? `${Math.round(venueData.distance*1000)} m`:`${Math.round(venueData.distance)} km`}</Typography>
                                        <Box style={{display: 'flex'}}><DirectionsWalk /><Typography style={{textTransform: 'lowercase'}}>{walkTime(venueData.distance)}</Typography></Box>
                                    </Box>
                                </Button>
                            ))
                        }
                        <Box className={classes.autoselect} onClick={() => autoselect()}>
                            <Typography style={{
                                color: darkmode ? '#fff':'#2fc2ad', 
                                 }}>Autoselect</Typography>
                            <LocationSearching style={{color: darkmode ? '#fff':'#2fc2ad'}} />
                        </Box>
                </Box>
            }
            {
                sortedblist &&
                !openSettings &&
                <Box className={classes.container} style={{background: !darkmode ? '#efefef' : '#222'}}>
                    {
                        sortedblist.map(bdata => (
                            <Button className={classes.venueBtn} style={{background: '#2fc8ad', color: !darkmode ? '#efefef' : '#222'}} onClick={() => handleChangeBuilding(bdata.buildingName)} title={bdata.buildingName} >
                                <Typography>{camelToTitle(bdata.buildingName)}</Typography>
                                <Box className={classes.display} title={`by walk ${walkTime(bdata.distance)}`}>
                                    <Typography style={{textTransform: 'lowercase'}}>{bdata.distance<1 ? `${Math.round(bdata.distance*1000)} m` : `${Math.round(bdata.distance)} km`}</Typography>
                                    <Box style={{display: 'flex'}}><DirectionsWalk /><Typography style={{textTransform: 'lowercase'}}>{walkTime(bdata.distance)}</Typography></Box>
                                </Box>
                            </Button>
                        ))
                    }
                </Box>
            }
            {
                !listview &&
                venue &&
                building &&
                !openSettings &&
                <GlobalView 
                    coordinates={coordinates} 
                    floorplan={floorplan} 
                    floor={floor} 
                    setFloor={setFloor} 
                    setFloorPlan={setFloorPlan}
                    venue={venue} 
                    building={building} 
                    setRooms={setRooms} 
                    rooms={rooms} 
                    globalCoords={globalCoords} 
                    landmarks={landmarks} 
                    value={value}
                    darkmode={darkmode}
                    setDarkmode={setDarkmode}
                    check={check}
                    setCheck={setCheck}
                    setBackdrop={setBackdrop}
                    />
            }
            {
                listview &&
                venue &&
                building &&
                !openSettings &&
                <Listview 
                    coordinates={coordinates} 
                    floorplan={floorplan} 
                    floor={floor} 
                    setFloor={setFloor} 
                    setFloorPlan={setFloorPlan}
                    venue={venue} 
                    building={building} 
                    setRooms={setRooms} 
                    rooms={rooms} 
                    globalCoords={globalCoords} 
                    landmarks={landmarks} 
                    value={value}
                    darkmode={darkmode}
                    setDarkmode={setDarkmode}
                    check={check}
                    setCheck={setCheck}
                    setBackdrop={setBackdrop}
                    />
            }
            
            {
                openSettings && 
                <Box className={classes.container} style={{background: !darkmode ? '#efefef' : '#222'}}>
                    <div className={classes.imgBx} style={{marginBottom: 10}}><img src={JSON.parse(localStorage.user).picture || 'https://i.pinimg.com/originals/84/77/49/847749560b5b8290f63622b241397cd2.png'} className={classes.profile} /></div>
                    <Typography style={{color: darkmode ? '#fff' : '#222', fontSize: 20}} className={classes.detail} >{JSON.parse(localStorage.user).name}</Typography>
                    <Typography style={{color: darkmode ? '#ccc' : '#666', textTransform: 'lowercase', lineHeight: 0}} className={classes.detail} >{JSON.parse(localStorage.user).email}</Typography>
                    <Typography style={{color: darkmode ? '#ccc':'#666', textTransform: 'lowercase', lineHeight: 0}} className={classes.detail}>{JSON.parse(localStorage.user).mobileNumber}</Typography>
                    <Box onClick={() => setDarkmode(!darkmode)} style={{cursor: 'pointer', color: darkmode ? '#fff' : '#222'}} title={darkmode ? 'switch to lightmode':'switch to darkmode'} >{darkmode ? <Brightness3 /> : <WbSunny />}</Box>
                    <Button style={{background: "#2fc8ad", margin: 'auto 0', color: !darkmode ? '#efefef' : '#222'}} title='Logout button' onClick={() => setOpen(true)}>Logout <ExitToApp /></Button>
                </Box>
            }
            <Dialog open={open} PaperProps={{ style: { background: !darkmode ? '#efefef' : '#222' }   }} >
                <Box className={classes.dialog} style={{background: !darkmode ? '#efefef' : '#222'}} title='do you want to logout?'>
                <Typography variant='h6' style={{color: '#f00'}}>Do you want to logout?</Typography>
                <Box className={classes.DActions}>
                    <Button onClick={() => setOpen(false)} variant='outlined' size='small' style={{
                                                                border: '1px solid #36e0c2', 
                                                                textTransform: 'capitalize', 
                                                                background: !darkmode ? '#efefef' : '#222',
                                                                color: !darkmode? '#222' : '#fff',
                                                                marginRight: 10
                                                            }} title='cancel button' >Cancel</Button>
                    <Button onClick={() => handleLogout()} variant='contained' size='small' style={{
                                                                border: 'none', 
                                                                textTransform: 'capitalize', 
                                                                background: '#36e0c2', 
                                                                color: !darkmode ? '#fff' : '#111', 
                                                                boxShadow: 'none'
                                                            }} title='confirm button' >Confirm</Button>
                </Box>
                </Box>
            </Dialog>
            <Backdrop className={classes.backdrop} open={backdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}


export default Home