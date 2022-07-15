export default (state=null,action)=>{
    switch(action.type){
        case 'USER_REGISTER':
            return action.payload
        default: 
            return state;
    }
}