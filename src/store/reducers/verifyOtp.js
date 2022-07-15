export default (state=[],action)=>{
    switch(action.type){
        case 'VERIFY_OTP':
            return action.payload
        default: 
            return state;
    }
}