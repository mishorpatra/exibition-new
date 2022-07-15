import React, {useState} from 'react'
import { makeStyles,Table, TableHead, TableBody, TableRow, TableCell, Typography, Box, Collapse, Button } from '@material-ui/core';

//components
import Details from './Details';

const useStyle = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
    floor: {
        textTransform: 'capitalize',
        fontSize: 18
    },
    
  });


const Row = ({
        floor_data,
        darkmode,
        landmarks,
        setBackdrop,
        venue,
        building
    }) => {
    const classes = useStyle()
    const [open, setOpen] = useState(false)
    const [openroom, setOpenroom] = useState(false)
   // console.log(landmarks)
    return (
        <>
            <TableRow className={classes.root}>
        <TableCell component="th" scope="row" onClick={() => setOpen(!open)} className={classes.floor}>
          <Button className={classes.floor} style={{background: '#2fc8ad', color: !darkmode ? '#efefef' : '#222'}} title={`${floor_data} floor`}>{floor_data} floor</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
                {
                    landmarks?.map(lmark => (
                        lmark.floor == floor_data && 
                            <Box>
                                <Details 
                                    lmark={lmark} 
                                    darkmode={darkmode}
                                    setBackdrop={setBackdrop}
                                    venue={venue}
                                    building={building}
                                />
                                
                            </Box>
                    ))
                }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
        </>
    )
}

export default Row