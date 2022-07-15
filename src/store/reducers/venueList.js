export default (state=null,action)=>{
    switch(action.type){
        case 'VENUE_LIST':
            return action.payload
        default: 
            return state;
    }
}