export default (state=[],action)=>{
    switch(action.type){
        case 'REF_POINT':
            return  action.payload;
        default:
            return state
    }
}