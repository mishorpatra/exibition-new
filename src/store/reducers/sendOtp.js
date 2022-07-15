export default (state=null,action)=>{
    switch(action.type){
        case 'SEND_OTP':
            return action.payload
        default: 
            return state;
    }
}