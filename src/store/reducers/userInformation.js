export default (state=null,action)=>{
    switch(action.type){
        case 'USER_INFORMATION':
            return action.payload
        default: 
            return state;
    }
}