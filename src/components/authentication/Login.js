import React, { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, makeStyles, CircularProgress, Toolbar, AppBar, Dialog } from '@material-ui/core'
import { WbSunny, Brightness3 } from '@material-ui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { signIn, addUser, addUserThroughMail } from '../../services/api'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

const useStyle = makeStyles(theme => ({
    component: {
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            height: '95vh',
        },
        background: '#222'
    },
    container: {
        width: '500px',
        minHeight: '400px',
        borderRadius: 10,
        background: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
        
    },
    input: {
        width: 241,
        height: 40,
        borderRadius: 8,
        marginBottom: 15,
        background: '#27282d',
        border: '2px solid #fff',
        color: '#fff',
        fontSize: 18,
        padding: '11px 16px 16px 18px',
        '&:focus': {
            outline: 'none'
        }
        
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    submit: {
        textTransform: 'capitalize',
        color: '#000',
        height: 64,
        width: 240,
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 24,
        marginBottom: 10
    },
    actions: {

    },
    link: {
        color: '#36e0c2',
        textDecoration: 'none'
    },
    heading: {
        alignSelf: 'flex-start',
        color: '#36e0c2',
        paddingLeft: 30,
    },
    subHeading: {
        color: '#333',
        alignSelf: 'flex-start',
        paddingLeft: 35,
        lineHeight: 0
    },
    header: {
        background: '#27282D'
    },
    signup: {
        width: 180,
        height: 64,
        paddign: '16px 9.5px',
        borderRadius: 8,
        textTransform: 'capitalize',
        fontWeight: 700,
        fontSize: 24
    },
    google: {
        marginTop: 20
    },
    footerBtns: {
        width: 276,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30,
        borderTop: '2px solid #fff',
        paddingTop: 30
    },
    forgotPass: {
        cursor: 'pointer', 
        color: '#fff', 
        textDecoration: 'underline',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    alert: {
        color: '#ff8080',
        textAlign: 'left',
        marginBottom: 20
    }
}))

const initialValues = {
    mobile: '',
    password: ''
}

const Login = ({ setUser, user, darkmode, setDarkmode }) => {
    const classes = useStyle()
    const [auth, setAuth] = useState(initialValues)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [success, setSuccess] = useState(false)

    /*useEffect(() => {
        window.sessionStorage.setItem("user", user);
      }, [user]);*/
      localStorage.setItem('user', JSON.stringify(user))

    const handleChange = (e) => { 
        setAuth({...auth, [e.target.name]: e.target.value})
    }

    const navigate = useNavigate()

    const handleSubmit = async () => {
        setLoading(true)
        let response = await signIn(auth)
        setLoading(false)
        //console.log(jwt_decode(response.data.token))   
        if(!response.data.success) {
            setOpen(true)
            return
        }
        setOpen(false)
        setUser(jwt_decode(response.data.token))
        setSuccess(true)
        setTimeout(() => {
            navigate('/')
        }, 1200)
    }

    const handleForgotPass = () => {
        
    }

    async function handleCallbackResponse(response) {
        //console.log("Encoded JWT ID token: " + response.credential)
        var userObject = jwt_decode(response.credential)  //userObject.jti is the id    
        setUser(userObject)
        //let resp = await axios.post('http://localhost:8000/exist', {mobileNumber: userObject.email})
       // if(resp.data.status) {
        await addUserThroughMail({
                name: userObject.name,
                email: userObject.email,
                mobile: '',
                password: '',
            })
        //}
        setSuccess(true)
        setTimeout(() => {
            navigate('/')
        }, 1200)
    }
    useEffect(() => {
        /*global google */
        
        google.accounts.id.initialize({
            client_id: "591935313021-m7bd8lqu77p0eetnt9ru6l9v56kcic6t.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: 'outlied', size: 'large' }
        )

        google.accounts.id.prompt()
    }, [])

    return (
        <Box className={classes.component} style={{background: darkmode ? '#222' : '#efefef'}}>
            <AppBar className={classes.header} style={{background: darkmode ? '#27282d' : '#fff'}}>
                <Toolbar className={classes.toolbar}>
                    <Typography></Typography>
                    <Typography style={{fontSize: 16, fontWeight: 500, textAlign: 'center', color: darkmode ? '#fff' : '#222'}}>SIGN IN/ SIGN-UP</Typography>
                    <Box style={{cursor: 'pointer'}} onClick={() => setDarkmode(!darkmode)} title={darkmode ? 'switch to lightmode':'switch to darkmode'}>{ !darkmode ? <WbSunny style={{color: darkmode ? '#fff' : '#222'}}  /> : <Brightness3 style={{color: darkmode ? '#fff' : '#222'}} /> }</Box>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} style={{background: !darkmode ? '#efefef' : '#222'}}>
               
                <Box className={classes.form}>
                    <input title='Enter registered your mobile number' placeholder="mobile number or email" name='mobile' style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} className={classes.input} onChange={(e) => handleChange(e)} />
                    <input title='Enter your password' placeholder="Password" name='password' type='password' style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} className={classes.input} onChange={(e) => handleChange(e)} />
                </Box>
                <Typography className={classes.alert} style={{display: open ? 'block' : 'none'}} >E-mail ID or password is incorrect.<br /> Please try again</Typography>
                {!loading && <Button variant='outlined' style={{background: '#2fc8ad', color: darkmode? '#222' : '#fff'}} className={classes.submit} title='sign in' onClick={() => handleSubmit()}>Sign in</Button>}
                {loading && <Button variant='outlined' style={{background: '#2fc8ad'}} className={classes.submit}><CircularProgress style={{color: darkmode ? '#000': '#fff'}} size={20} /></Button>}

                <Box className={classes.actions}>
                <Typography onClick={() => handleForgotPass()} style={{cursor: 'pointer', color: darkmode?'#fff': '#222', textDecoration: 'underline'}}>Forgot Password?</Typography>

                <Box className={classes.footerBtns} style={{borderColor: darkmode ? '#fff' : '#222'}}>
                    <Button variant='outlined' style={{background: '#2fc8ad', color: darkmode ? '#222' : '#fff'}} className={classes.signup} onClick={() => navigate('/signup')} title='sign up'>Sign-Up</Button>
                    <Box  className={classes.google} id='signInDiv' title='google sign in'></Box>
                </Box>
                </Box>
                <Dialog open={success} PaperProps={{ style: { borderRadius: 100 }   }}>
                    <img src="https://i.imgur.com/7nuteoI.gif" />
                </Dialog>
            </Box>
        </Box>
    )
}

export default Login