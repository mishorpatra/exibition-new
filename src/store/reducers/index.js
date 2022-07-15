import {combineReducers} from 'redux';
import userLogin from './userLogin';
import userRegister from './userRegister';
import forgotPassword from './forgotPassword';
import userDetails from './userDetails';
import resetPassword from './resetPassword'; 
import sendOtp from './sendOtp';
import buildingList from './buildingList';
import venueList from './venueList';
import navigationInfo from './navigationInfo';
import floorList from './floorList';
import gpsLocation from './gpsLocation';
import verifyOtp from './verifyOtp';
import verifyEmailotp from './verifyEmailotp';
import sendEmailotp from './sendEmailotp';
import userInformation from './userInformation';
import userPortfolio from './userPortfolio';
import updateName from './updateName';
import updateEmail from './updateEmail';
import updatePassword from './updatePassword';
import updateMobile from './updateMobile';
import updateLanguage from './portfolio/updateLanguage';
import updateAgegroup from './portfolio/updateAgegroup';
import updateVision from './portfolio/updateVision';
import updateWalking from './portfolio/updateWalking';
import updateHeight from './portfolio/updateHeight';
import androidNavigation from './androidNavigation';
import saveAddress from './saveAddress';
import osmRoutes from './osmRoutes';
import navContent from './navContent';
import refPoint from './refPoint';
import globalNavigation from './globalNavigation';

export default combineReducers({
    userLogin: userLogin,
    userRegister:userRegister,
    forgotPassword:forgotPassword,
    userDetails:userDetails,
    resetPassword:resetPassword,
    sendOtp:sendOtp,
    sendEmailotp:sendEmailotp,
    venueList:venueList,
    buildingList:buildingList,
    navigationInfo:navigationInfo,
    floorList:floorList,
    gpsLocation:gpsLocation,
    verifyOtp:verifyOtp,
    verifyEmailotp:verifyEmailotp,
    userInformation:userInformation,
    updateName,
    updateEmail,
    updatePassword,
    updateMobile,
    userPortfolio,
    updateLanguage,
    updateHeight,
    updateAgegroup,
    updateVision,
    updateWalking,
    androidNavigation,
    globalNavigation,
    saveAddress,
    osmRoutes,
    navContent,
    refPoint:refPoint,

});