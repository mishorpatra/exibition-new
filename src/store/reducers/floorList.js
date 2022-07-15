export default(state=[],action)=>{
    switch(action.type){
        case 'FLOOR_LIST':
            return action.payload;
        default:
            return state;
    }
}