export default(state=[],action)=>{
    switch(action.type){
        case 'GPS_LOCATION':
            return action.payload;
        default:
            return state;
    }
}