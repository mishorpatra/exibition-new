export default (state=null,action)=>{
    switch(action.type){
        case 'FORGOT_PASSWORD':
            return action.payload
        default: 
            return state;
    }
}