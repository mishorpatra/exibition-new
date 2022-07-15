export default (state=null,action)=>{
    switch(action.type){
        case 'ANDROID_NAVIGATION':
            return action.payload
        default: 
            return state;
    }
}