
import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { makeStyles, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Box } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import 'react-tabs/style/react-tabs.css';
import useWindowDimensions from '../services/getWindowSize';

const useStyle = makeStyles(theme => ({
    component: {
        display: 'flex',
        zIndex: 9999,
        background: '#fff',
    },
    formControl: {
        minWidth: 150
    },
    tabpanel: {
        background: '#fff'
    },
    arrows: {
        display: 'none',
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 9999,
        cursor: 'pointer',
        [theme.breakpoints.down('sm')]: {
            display: 'flex'
        }
    },
}))

const TabView = ({ 
        venues,
        openVenue,
        venue,
        handleChange,
        handleCloseVenue,
        handleOpenVenue,
        building,
        openBuilding,
        handleOpenBuilding,
        handleChangeBuilding,
        handleCloseBuilding,
        value,
        setValue,
        setBuilding

    }) => {
    const classes = useStyle()

    const { width } = useWindowDimensions()
    const filter = createFilterOptions()

    const handleBack = () => {
        setBuilding()
    }


    return (
  <Tabs className={classes.component}>
    <Box className={classes.arrows} onClick={() => handleBack()} >
         {venue && building && <ArrowBack style={{margin: '10px 10px 0 0'}} />}
     </Box>
    <TabList>
      {(width>958 || !venue || !building) && <Tab>
    <FormControl className={classes.formControl} >
    <InputLabel id="demo-controlled-open-select-label">{venue ? venue.venueName : "Select Venue"}</InputLabel>
     <Select
     labelId="demo-controlled-open-select-label"
     id="demo-controlled-open-select"
     open={openVenue}
     onClose={handleCloseVenue}
     onOpen={handleOpenVenue}
     value={venue}
     onChange={handleChange}
     >
    
    
     <Typography variant='h6' style={{
        padding: '10px 15px',
        marginTop: 50
     }}>Please Chose a venue to continue...</Typography>
     {
         venues?.data.map(data => (
             <MenuItem value={data}  >{data.venueName}</MenuItem>
         ))
     }
     </Select>
 </FormControl> </Tab>}
      {(width>958 || !venue || !building) &&<Tab>
        {venue && <FormControl className={classes.formControl} >
        <InputLabel id="demo-controlled-open-select-label">Select Building</InputLabel>
        <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={openBuilding}
        onClose={handleCloseBuilding}
        onOpen={handleOpenBuilding}
        value={building}
        onChange={handleChangeBuilding}
        >
        <Typography variant='h6' style={{
        padding: '10px 15px',
        marginTop: 50
        }}>Please Chose a building...</Typography>
        {
            venue?.buildingList?.map(data => (
                <MenuItem value={data}>{data}</MenuItem>
            ))
        }
        </Select>
    </FormControl>}</Tab>}
      <Tab>    { venue && building && <Autocomplete
        className={classes.search}
         value={value}
         onChange={(event, newValue) => {
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
             //console.log(value)
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
         style={{ width: 300 }}
         freeSolo
         renderInput={(params) => (
             <TextField {...params} label="Search for rooms, offices etc..." variant="outlined"  />
         )}
     />}</Tab>
    </TabList>

    
  </Tabs>
)};

const blocks = [
    {title: 'All'},
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

export default TabView