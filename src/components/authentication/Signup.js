import React, {useState} from 'react'
import { Box, Typography, TextField, Button, makeStyles, Dialog, CircularProgress, Toolbar, AppBar } from '@material-ui/core'
import { CheckCircle, ArrowBack, Cancel, Brightness3, WbSunny } from '@material-ui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { sendOtp, addUser, checkOtp } from '../../services/api'



const useStyle = makeStyles(theme =>({
    component: {
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#222',
        [theme.breakpoints.down('sm')]: {
            height: '95vh',
        },
    },
    container: {
        width: '500px',
        minHeight: '300px',
        borderRadius: 10,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'inherit'
    },
    containerDialog: {
        width: '500px',
        minHeight: '300px',
        borderRadius: 10,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            width: '290px'
        }
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
    submit: {
        textTransform: 'capitalize',
        color: '#000',
        height: 64,
        width: 276,
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 24,
        marginBottom: 10
    },
    link: {
        color: '#36e0c2',
        textDecoration: 'none'
    },
    heading: {
        color: '#36e0c2',
    },
    subHeading: {
        color: '#333',
        alignSelf: 'flex-start',
        paddingLeft: 35,
        lineHeight: 0
    },
    form: {
        width: '80%'
    },
    check: {
        position: 'relative',
        left: 10,
        bottom: 5
    },
    header: {
        background: '#27282D',
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    otp: {
        width: 240,
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
    check: {
        '&>*': {
            color: '#fff',
            textAlign: 'left',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between'
        },
        marginBottom: 15
    },
    checks: {
        fontSize: 18,
        position: 'relative',
        top: 5,
    }
}))

const initialValues = {
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const Signup = ({ darkmode, setDarkmode }) => {
    const classes = useStyle()
    const [open, setOpen] = useState(false)
    const [verified, setVerified] = useState(false)
    const [user, setUser] = useState(initialValues)
    const [loading, setLoading] = useState(false)
    const [loadingSignup, setLoadingSignup] = useState(false)
    const [inputOtp, setInputOtp] = useState('')
    const [verifying, setVerifying] = useState(false)
    const [error, setError] = useState(false)

    const navigate = useNavigate()



    const handleClose = () => {
        setOpen(false)
    }
    const handleOtp = async () => {
        if(!user.mobile || user.mobile.length !== 10 && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.mobile)) {
            setError(true)
            return
        }
        setLoading(true)
        let response = await sendOtp(user.mobile)
        setLoading(false)
        if(response && !response.data.status) {
            alert("user already exists")
            return
        }
        if(response && !response.data.success) {
            alert("Mobile verification failed")
            return
        }
        else setOpen(true)
    }
    const handleOtpChange = (e) => {
        setInputOtp(e.target.value)
    }
    const handleVerify = async () => {
        setVerifying(true)
        let response = await checkOtp({
            mobileNumber: user.mobile,
            otp: inputOtp
        })
        setVerifying(false)
        if(response.data.success !== 'approved') {
            setError(true)
            return
        }
        else setVerified(true)
    }
    const handleSignUp = async () => {
        if(user.password.length < 8 || !containsCapital(user.password) || user.password !== user.confirmPassword || !/\d/.test(user.password)) {
            setError(true)
            return
        }
        setLoadingSignup(true)
        let response = await addUser(user)
        setLoadingSignup(false)
        if(!response.data.success) {
            alert(response.data.message)
            return
        }
        navigate('/signin')
        alert('User saved successfully')
    }

    const handleChange = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }

    const containsCapital = (str) => {
        for (var i=0; i<str.length; i++){
            if (str.charAt(i) == str.charAt(i).toUpperCase() && str.charAt(i).match(/[a-z]/i)){
              return true;
            }
          }
          return false;
    }

    return !verified && !open ? (
        <Box className={classes.component} style={{background: darkmode ? '#222' : '#efefef'}}>
            <AppBar className={classes.header} style={{background: darkmode ? '#27282d' : '#fff'}}>
                <Toolbar className={classes.toolbar}>
                <Button title='back button'><ArrowBack style={{cursor: 'pointer', color: darkmode ? '#fff' : '#222'}} onClick={() => navigate('/signin')} /></Button>
                <Typography style={{fontSize: 16, fontWeight: 500, textAlign: 'center', color: darkmode ? '#fff' : '#222'}}>Verify</Typography>
                <Box onClick={() => setDarkmode(!darkmode)} style={{cursor: 'pointer'}} title={darkmode ? 'switch to light mode':'switch to darkmode'} >{darkmode ? <Brightness3 /> : <WbSunny style={{color: darkmode ? '#fff' : '#222'}} />}</Box>
                </Toolbar>
            </AppBar>
            <Box className={classes.container} style={{background: darkmode ? '#222' : '#efefef'}}>
                
                <Box className={classes.form}>
                    <input placeholder="mobile number or email" style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} className={classes.input} name='mobile' onChange={(e) => handleChange(e)} />
                </Box>
                {error && <Typography style={{color: '#ff8080'}}>mobile number or email invalid</Typography>}
                {!loading && <Button variant='contained' style={{background: '#2fc8ad', color: darkmode? '#222' : '#fff'}} className={classes.submit} onClick={() => handleOtp()} title='send OTP button'>Send OTP</Button>}
                {loading && <Button variant='contained' style={{background: '#2fc8ad'}} className={classes.submit} ><CircularProgress size={22} color='#fff' /></Button>}
                <Box className={classes.actions}>
                </Box>
            </Box>
        </Box>
    ) : !verified && open ?  
    <Box className={classes.component} style={{background: darkmode ? '#222' : '#efefef'}}>
    <AppBar className={classes.header} style={{background: darkmode ? '#27282d' : '#fff'}}>
        <Toolbar className={classes.toolbar}>
        <Button title='back button'><ArrowBack style={{cursor: 'pointer', color: darkmode ? '#fff' : '#222'}} onClick={() => navigate('/signin')} /></Button>
        <Typography style={{fontSize: 16, fontWeight: 500, textAlign: 'center', color: darkmode ? '#fff' : '#222'}}>ENTER OTP</Typography>
        <Box onClick={() => setDarkmode(!darkmode)} style={{cursor: 'pointer'}} title={darkmode ? 'switch to light mode':'switch to darkmode'} >{darkmode ? <Brightness3 /> : <WbSunny style={{color: darkmode ? '#fff' : '#222'}} />}</Box>
        </Toolbar>
    </AppBar>
    
        <Box className={classes.container}>
            <Typography style={{color: darkmode ? '#fff' : '#222', fontSize: 16, marginBottom: 10}} >Please enter the 6-digit code sent to your registered mobile number or email and press CONTINUE. If you do not receive a code within 1 minute, please press Resend OTP </Typography>
            <Box className={classes.form} title='Enter yout otp'>
                <input placeholder="Enter 6-digit code" style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} className={classes.otp} onChange={(e) => handleOtpChange(e)} />
            </Box>
            {error && <Typography style={{color: '#ff8080'}}>OTP did not match</Typography>}
            {!verifying && <Button variant='contained' style={{background: '#2fc8ad', color: darkmode? '#222' : '#fff'}} title='verify OTP button' className={classes.submit} onClick={() => handleVerify()}>verify</Button>}
            {verifying && <Button variant='contained' style={{background: '#2fc8ad'}} className={classes.submit}><CircularProgress color='#fff' size={22} /></Button> }
            <Button variant='contained' style={{background: '#2fc8ad', color: darkmode? '#222' : '#fff'}} title='resend OTP' className={classes.submit}  onClick={() => handleOtp()}>Resend OTP</Button>
            </Box>
        </Box>
     : 
    <Box className={classes.component} style={{background: darkmode ? '#222' : '#efefef'}}>
        <AppBar className={classes.header} style={{background: darkmode ? '#27282d' : '#fff'}}>
            <Toolbar className={classes.toolbar}>
                <ArrowBack style={{cursor: 'pointer', color: darkmode ? '#fff' : '#222'}} onClick={() => navigate('/signin')} />
                <Typography style={{fontSize: 16, fontWeight: 500, textAlign: 'center', color: darkmode ? '#fff' : '#222'}}>SIGN IN/ SIGN UP</Typography>
                <Box onClick={() => setDarkmode(!darkmode)} style={{cursor: 'pointer'}} title={darkmode ? 'switch to light mode':'switch to darkmode'}>{darkmode ? <Brightness3 /> : <WbSunny style={{color: darkmode ? '#fff' : '#222'}} />}</Box>
            </Toolbar>
        </AppBar>
            <Box className={classes.container} style={{height: 500}}>
                {error && <Typography style={{color: '#ff8080'}}>Please fill all the fields</Typography>}
                {(user.password !== user.confirmPassword) && <Typography style={{color: '#ff8080', marginBottom: 10}}>Password did not match</Typography>}
                <Box className={classes.form}>
                    <input style={{display: 'none'}} />
                    <input title='Enter full name' placeholder="Full Name" name='name'  className={classes.input} onChange={(e) => handleChange(e)} style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} />
                    {/*<input title='Enter email' placeholder="Email" name='email'  className={classes.input} onChange={(e) => handleChange(e)} style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} />*/}
                    <input title='Enter password' placeholder="Password" name='password' type='password' className={classes.input} onChange={(e) => handleChange(e)} style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} />
                    <input title='confirm password' placeholder="Confirm Password" type='password' name='confirmPassword' className={classes.input} onChange={(e) => handleChange(e)} style={{background: darkmode? '#27282d' : '#cdc', color: darkmode ? '#fff': '#222', borderColor: darkmode ? '#fff' : '#2fc8ad'}} />
                </Box>
                <Box className={classes.check} style={{display: user.password ? 'block' : 'none'}}>
                    <Typography style={{color: darkmode ? '#fff' : '#222'}}>Password must contain:</Typography>
                    <Typography style={{color: darkmode ? '#fff' : '#222'}}>8 characters 
                        {user.password.length >= 8 && <CheckCircle className={classes.checks} style={{color: '#2fc8ad'}} />}
                        {user.password.length < 8 && <Cancel className={classes.checks} style={{color: '#ff8080'}} />}
                    </Typography>
                    <Typography style={{color: darkmode ? '#fff' : '#222'}}>1 capital letter 
                        {containsCapital(user.password) && <CheckCircle className={classes.checks} style={{color: '#2fc8ad'}} />}
                        {!containsCapital(user.password) && <Cancel className={classes.checks} style={{color: '#ff8080'}} />}
                    </Typography>
                    <Typography style={{color: darkmode ? '#fff' : '#222'}}>1 number 
                        { /\d/.test(user.password) && <CheckCircle className={classes.checks} style={{color: '#2fc8ad'}} />}
                        { !/\d/.test(user.password) && <Cancel className={classes.checks} style={{color: '#ff8080'}} />}
                    </Typography>
                </Box>
                {!loadingSignup && <Button variant='contained' style={{background: '#2fc8ad', color: darkmode? '#222' : '#fff'}} className={classes.submit}  onClick={() => handleSignUp()} title='sign up button' >Sign up</Button>}
                {loadingSignup && <Button variant='contained' style={{background: "#2fc8ad"}} className={classes.submit} ><CircularProgress size={22} style={{color: darkmode ? '#222' : 'fff'}} /></Button>}

            </Box>
        </Box>
}

export default Signup