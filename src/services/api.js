import axios from 'axios'

import { getGlobalPoints } from './convert'


export const getVenues = async () => {
    try {
        let response = await axios.post("https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/app/venue-list")
        return response.data
    } catch(error) {
        console.log('Error while getting the venues ', error)
    }
}
/*export const getBuildings = async (venue_name) => {
    let data=`{\n    \"venueName\":\"" + ${venue_name} + "\"\n}`
    console.log(venue_name)
    try {
        let response = await axios.post(`https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/app/building-list/`, data)
        console.log(response.data)
    } catch(error) {
        console.log('Error while getting the buildings ', error)
    }
  
}*/

export const getBuildingData = async (venue_name, building_name, floor) => {
    try {
        let response = await axios.get(`https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/global-ref/${venue_name}/${building_name}/${floor}`)
        return response.data
    } catch(error) {
        console.log('Error while getting the building data ', error)
    }
}

export const getRoomsData = async (venue_name, building_name) => {
    
    
    try {
        let response = await axios.get(`https://inclunav.apps.iitd.ac.in/node/wayfinding/v1/app/android-navigation/${venue_name}/${building_name}/null`)
        //console.log(response.data)


        let data = response.data
        //console.log(data)
        let floors = [...new Set(data.map(s => s.floor))]
        //extract the floors
        //polygon data or nonwalkables of all floors
        
        let poly_data = data.slice(data.length - floors.length,data.length);
        console.log(poly_data.global)
        let red_data = data.slice(0, data.length - floors.length);
        // console.log(floors);
        let fdata=poly_data.map(s=>s.floor)
        const ldata=poly_data.map(s=>s.properties.floorLength)
          



        return response.data
    }
    catch (error) {
        console.log('Error while getting the whole building data ', error)
    }
}

export const getGlobalCoords = (venue_name, building_name, setGlobalCoords, setLandmarks) => {
    getGlobalPoints(venue_name, building_name, setGlobalCoords, setLandmarks)
}

const URL='http://localhost:8000'
const neo4jURL = 'https://inclunav.apps.iitd.ac.in/node/wayfinding/v1'

export const sendOtp = async (mobile) => {
    const post = { mobileNumber: mobile }
    try {
        /*let response = await axios.post('https://inclunav.herokuapp.com/exist', post)
        if(response && !response.data.status) {
            return response
        }*/
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mobile)) {
            return await axios.post('https://indoor-otp.herokuapp.com/otp/send-email', {email: mobile})
        }
        return await axios.post(`https://indoor-otp.herokuapp.com/otp/start-verify`, post)
    } catch(error) {
        console.log('Error while calling the send otp api ', error)
    }
}

export const checkOtp = async (post) => {
    try {
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(post.mobileNumber)) {
            return await axios.post(`https://indoor-otp.herokuapp.com/otp/verify-email-otp`, {email: post.mobileNumber, otp: post.otp})
        }
        return await axios.post(`https://indoor-otp.herokuapp.com/otp/check-otp`, post)
    } catch (error) {
        console.log('Error while calling the check otp api ', error)
    }
}

export const addUser = async (post) => {
    const data = {
        mobileNumber: post.mobile,
        name: post.name,
        password: post.password,
    }
    try {
       // console.log(post)
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(post.mobile)) {
            console.log(post.name.split(" ")[0])
            return await axios.post(`${neo4jURL}/register`, {
                data: {
                    email: post.mobile,
                    firstname: post.name.split(" ")[0],
                    lastname: post.name.split(" ")[1],
                    companyName: 'unknown',
                    password: post.password,
                    mode: 'manual'
                }
            })
        }
        return await axios.post(`${neo4jURL}/user-register`, data)
    } catch(error) {
        console.log(error)
    }
}

export const addUserThroughMail = async (post) => {
    try {
        return await axios.post(`${neo4jURL}/user-register`, post)
    } catch (error) {
        console.log('Error while adding the user', error)
    }
}

/*export const addDevice = async (device) => {
    try {
        const post = { device_code: device }
        return await axios.post(`${URL}/admin/save-device`, post)
    } catch(error) {
        console.log(error)
    }
}*/

/*export const getDevice = async (id) => {
    try {
        let response = await axios.get(`${URL}/user/device/${id}`)
       // console.log(response.data)
        return await response.data
    } catch(error) {
        console.log('Error while getting all devices ', error)
    }
}*/

export const signIn = async (post) => {
    try {
        let data = {
            mobileNumber: post.mobile,
            mode: "manual",
            password: post.password
        }
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(post.mobile)) {
            return await axios.post(`${neo4jURL}/login`, {
                data: {
                    email: post.mobile,
                    mode: "manual",
                    password: post.password
                }
            })
        }
        return await axios.post(`${neo4jURL}/user-login`, data)
    } catch(error) {
        console.log('Error while signing in ', error)
    }
}

export const locateUser = async (id) => {
    try {
        let response = await axios.get(`${URL}/locate/${id}`)
        return response.data
    } catch (error) {
        console.log('Error while locating the user', error)
    }
}


