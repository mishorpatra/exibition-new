let config = {};

let url ="https://inclunav.apps.iitd.ac.in/node/wayfinding"; 
// let url ="http://localhost:5000"; 

if(process.env.NODE_ENV === "development"){
    config.login = url + "/v1/user-login"
    config.register = url + "/v1/user-register"
    config.userDetails = url + "/v1/app/user-details"
    config.forgotPassword = url + "/v1/app/forgot-password"
    config.resetPassword = url + "/v1/app/reset-password"
    config.sendOtp = "https://indoor-otp.herokuapp.com/otp/start-verify"
    config.verifyOtp = "https://indoor-otp.herokuapp.com/otp/check-otp"
    config.sendEmailOtp = "https://indoor-otp.herokuapp.com/otp/send-email"
    config.verifyEmailOtp = "https://indoor-otp.herokuapp.com/otp/verify-email-otp"
    config.venueList = url + "/v1/app/venue-list"
    config.buildingList = url + "/v1/app/building-list"
    config.floorList = url + "/v1/app/floor-list"
    config.navigationData = url + "/v1/app/navigation-data"
    // config.imgUrl = url+"/public"    
    config.imgUrl = "http://inclunav.apps.iitd.ac.in/static" 
    config.userInformation = url + "/v1/app/user-information"
    config.updateName = url + "/v1/app/name-update"
    config.updatePassword = url + "/v1/app/password-update"
    config.updateEmail = url + "/v1/app/email-update"
    config.updateMobile = url + "/v1/app/mobile-update"
    config.userPortfolio = url + "/v1/app/user-portfolio"
    //
    config.updateLanguage = url + "/v1/app/language-update"
    config.updateVision = url + "/v1/app/vision-update"
    config.updateHeight = url + "/v1/app/height-update"
    config.updateAgegroup = url + "/v1/app/age-update"
    config.updateWalking = url + "/v1/app/walking-update"
    config.androidNavigation = url + "/v1/app/android-navigation"
    config.osmRoutes = "http://router.project-osrm.org/route/v1/driving/"
    config.osmRoutes = url + "/v1/app/building-pickupoints"
    config.globalRef = url + "/v1/global-ref/"
}
else
{
    config.login = url + "/v1/user-login"
    config.register = url + "/v1/user-register"
    config.userDetails = url + "/v1/app/user-details"
    config.forgotPassword = url + "/v1/app/forgot-password"
    config.resetPassword = url + "/v1/app/reset-password"
    config.sendOtp = "https://indoor-otp.herokuapp.com/otp/start-verify"
    config.verifyOtp = "https://indoor-otp.herokuapp.com/otp/check-otp"
    config.sendEmailOtp = "https://indoor-otp.herokuapp.com/otp/send-email"
    config.verifyEmailOtp = "https://indoor-otp.herokuapp.com/otp/verify-email-otp"
    config.venueList = url + "/v1/app/venue-list"
    config.buildingList = url + "/v1/app/building-list"
    config.floorList = url + "/v1/app/floor-list"
    config.navigationData = url + "/v1/app/navigation-data"
    // config.imgUrl = url+"/public"    
    config.imgUrl = "http://inclunav.apps.iitd.ac.in/static"  
    config.userInformation = url + "/v1/app/user-information"
    config.updateName = url + "/v1/app/name-update"
    config.updatePassword = url + "/v1/app/password-update"
    config.updateEmail = url + "/v1/app/email-update"
    config.updateMobile = url + "/v1/app/mobile-update"
    config.userPortfolio = url + "/v1/app/user-portfolio"
    //
    config.updateLanguage = url + "/v1/app/language-update"
    config.updateVision = url + "/v1/app/vision-update"
    config.updateHeight = url + "/v1/app/height-update"
    config.updateAgegroup = url + "/v1/app/age-update"
    config.updateWalking = url + "/v1/app/walking-update"
    config.androidNavigation = url + "/v1/app/android-navigation"
    config.osmRoutes = "http://router.project-osrm.org/route/v1/driving/"
    config.pickUpPoints = url + "/v1/app/building-pickupoints"
    config.globalRef = url + "/v1/global-ref/"
}

export default config;