export default (state=null,action)=>{
    switch(action.type){
        case 'PICKUP_POINTS':
            return action.payload
        default: 
            return state;
    }
}