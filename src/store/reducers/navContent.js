export default (state=null,action)=>{
    switch(action.type){
        case 'NAV_CONTENT':
            return action.payload
        default: 
            return state;
    }
}