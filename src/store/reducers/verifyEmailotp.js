export default (state=[],action)=>{
    switch(action.type){
        case 'VERIFY_EMAILOTP':
            return action.payload
        default: 
            return state;
    }
}