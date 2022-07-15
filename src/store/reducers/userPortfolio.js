export default (state=null,action)=>{
    switch(action.type){
        case 'USER_PORTFOLIO':
            return action.payload
        default: 
            return state;
    }
}