export default (state=[],action)=>{
    switch(action.type){
        case 'NAVIGATION_INFO':
            return action.payload;
        default:
            return state;
    }
}
