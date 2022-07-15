import React from 'react'
import { AppBar, Toolbar, makeStyles, Typography } from '@material-ui/core'
import { ArrowBack, Settings as Setting } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom'

const useStyle = makeStyles({
    navBar: {
        background: '#27282D', 
        transition: 0.5,
        height: 'max-content',
        padding: 0,
        margin: 0,
    },
    toolbar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    arrows: {
        cursor: 'pointer'
    }
})


const Settings = () => {

    const classes = useStyle()
    const navigate = useNavigate()

    if(!localStorage.user || localStorage.user == 'undefined') navigate('/signin')

    const handleBack = () => {
        navigate('/')
    }


    return (
        <AppBar className={classes.navBar}>
            <Toolbar className={classes.toolbar}>
                <ArrowBack onClick={() => handleBack()} className={classes.arrows}/>
                <Typography>Settings</Typography>
                <Typography></Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Settings