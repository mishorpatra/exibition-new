import axios from 'axios';
import config from '../../config';

export const userLogin = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(`${config.login}`,data);
    const getDetails = response.data;
    dispatch({type:'USER_LOGIN',payload:getDetails})
    cb()
}

export const userRegister = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(`${config.register}`,data);
    const getDetails = response.data;
    dispatch({type:'USER_REGISTER',payload:getDetails})
    cb()
}

export const sendOtp = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(`${config.sendOtp}`,data);
    const getDetails = response.data;
    dispatch({type:'SEND_OTP',payload:getDetails})
    cb()
}

export const verifyOtp = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(`${config.verifyOtp}`,data);
    const getDetails = response.data;
    dispatch({type:'VERIFY_OTP',payload:getDetails})
    cb()
}

export const sendEmailotp = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(`${config.sendEmailOtp}`,data);
    const getDetails = response.data;
    dispatch({type:'SEND_EMAILOTP',payload:getDetails})
    cb()
}

export const verifyEmailotp = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(`${config.verifyEmailOtp}`,data);
    const getDetails = response.data;
    dispatch({type:'VERIFY_EMAILOTP',payload:getDetails})
    cb()
}

export const forgotPassword = (data)=> async (dispatch)=>{
    const response = await axios.post(`${config.forgotPassword}`,data);
    const getDetails = response.data;
    dispatch({type:'FORGOT_PASSWORD',payload:getDetails})

}

export const userDetails = (data)=> async (dispatch)=>{
    const response = await axios.post(config.userDetails,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'USER_DETAILS',payload:getDetails})
}

export const resetPassword = (data)=> async (dispatch)=>{
    const response = await axios.post(config.resetPassword,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'RESET_PASSWORD',payload:getDetails})
}

// export const venueList = (data)=> async (dispatch)=>{
//     const response = await axios.post(config.venueList,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
//     const getDetails = response.data;
//     dispatch({type:'RESET_PASSWORD',payload:getDetails})
// }

export const getAllBuildingElements = (data,next)=> async (dispatch)=>{
    const response = await axios.get(`${config.navigationData}/${data.venueName}/${data.buildingName}/null`);
    const responseData = response.data;
    dispatch({type:'NAVIGATION_INFO',payload:responseData})
    next(); 
}

export const androidNavigation = (data,next)=> async (dispatch)=>{
    const response = await axios.get(`${config.androidNavigation}/${data.venueName}/${data.buildingName}/null`);
    const responseData = response.data;
    let arra = [];
    for (let i = 0; i < responseData.length; i++) {
      if (responseData[i].element.type === "Floor") {
          arra.push(responseData[i])
    }
    }
    dispatch({type:'ANDROID_NAVIGATION',payload:arra})
    next(); 
}

export const globalNavigation = (data,next)=> async (dispatch)=>{
    const response = await axios.get(`${config.androidNavigation}/${data.venueName}/${data.buildingName}/null`);
    console.log("data",data,response)
    const responseData = response.data;
    dispatch({type:'GLOBAL_NAVIGATION',payload:responseData})
    next(); 
}

export const imgDetails = (venue,buildingname,floor,file,cb)=> async  (dispatch)=>{
    const response = await axios.get(`${config.imgDetails}${venue}/${buildingname}/${floor}/${file}`)
    const pathResponse = response.data;
    dispatch({type:'FETCH_IMAGE',payload: pathResponse});
    cb();
}

export const refPoint =  (venue,building,floor,cb) => async (dispatch) => {
    const response = await axios.get(`${config.globalRef}${venue}/${building}/${floor}`);
    const responseData = response.data;
    console.log("response",responseData,venue,building,floor)
    dispatch({type:'REF_POINT',payload:responseData})
    cb()
}

export const floorList = (buildingName,next)=> async (dispatch)=>{
    const response = await axios.post(config.floorList,{buildingName:buildingName});
    const allFloors = response.data;
    dispatch({type:'FLOOR_LIST',payload: allFloors})
    next()
}

export const venueList = (next)=> async (dispatch)=>{
    const response = await axios.post(config.venueList);
    const getDetails = response.data;
    dispatch({type:'VENUE_LIST',payload:getDetails});
    next();
}

// export const buildingList = (data)=> async (dispatch)=>{
//     const response = await axios.post(config.buildingList,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
//     const getDetails = response.data;
//     dispatch({type:'BUILDING_LIST',payload:getDetails})
// }

export const buildingList = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.buildingList,data);
    const getDetails = response.data;
    dispatch({type:'BUILDING_LIST',payload:getDetails})
    cb()
}

export const getGpsLocation = (data,cb)=> async (dispatch)=>{
    let latitude = data.lat.toString()
    let longitude = data.lng.toString()
    let url = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en&polygon_threshold=0.0`
    let resp = await fetch(url,{
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "23d4e05de9msh6374022ee59c78ap1c8dfdjsn43be9985d2e1",
        "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com",
        "useQueryString": true
      }
    })
    let dt = await resp.json()
    dispatch({type:'GPS_LOCATION',payload:dt})
    cb()
}

//Settings section
export const getUserInformation = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.userInformation,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'USER_INFORMATION',payload:getDetails})
    cb()
}

export const getUserPortfolio = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.userPortfolio,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'USER_PORTFOLIO',payload:getDetails})
    cb()
}

export const updateName = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateName,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'UPDATE_NAME',payload:getDetails})
    cb()
}

export const updatePassword = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updatePassword,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'UPDATE_PASSWORD',payload:getDetails})
    cb()
}

export const updateMobile = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateMobile,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'UPDATE_MOBILE',payload:getDetails})
    cb()
}

export const updateEmail = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateEmail,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    console.log("update email response",response)
    dispatch({type:'UPDATE_EMAIL',payload:getDetails})
    cb()
}
///
export const updateLanguage = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateLanguage,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'UPDATE_LANGUAGE',payload:getDetails})
    cb()
}

export const updateVision = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateVision,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;

    dispatch({type:'UPDATE_VISION',payload:getDetails})
    cb()
}

export const updateHeight = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateHeight,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'UPDATE_HEIGHT',payload:getDetails})
    cb()
}

export const updateAgegroup = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateAgegroup,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'UPDATE_AGEGROUP',payload:getDetails})
    cb()
}

export const updateWalking = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.updateWalking,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'UPDATE_WALKING',payload:getDetails})
    cb()
}

export const saveAddress = (data,cb)=> async (dispatch)=>{
    const response = await axios.post(config.saveAddress,data,{headers:{ 'Content-Type': 'application/json', 'Authorization': `${data.token}` }});
    const getDetails = response.data;
    dispatch({type:'SAVE_ADDRESS',payload:getDetails})
    cb()
}

export const osmRoutes = (data,cb)=> async (dispatch)=>{
    let srcLat = data.srcLat;
    let srcLng = data.srcLng;
    let dstLat = data.dstLat;
    let dstLng = data.dstLng;
    // console.log("ww",`${config.osmRoutes}start=${srcLat},${srcLng}&end=${dstLat},${dstLng}`)
    // const response = await axios.get(`${config.osmRoutes}${srcLat},${srcLng};${dstLat},${dstLng}?overview=false`);
    // const getDetails = response.data;
    const getDetails = [];
    dispatch({type:'OSM_ROUTES',payload:getDetails})
    cb()
}

export const pickupPoints = (data,cb)=> async (dispatch)=>{
    const response = await axios.get(`${config.pickUpPoints}/${data.venue}/${data.building}`);
    const getDetails = response.data;
    dispatch({type:'PICKUP_POINTS',payload:getDetails})
    cb()
}

export const navContent = (data,cb)=> async (dispatch)=>{
    dispatch({type:'NAV_CONTENT',payload:data})
    cb()
}