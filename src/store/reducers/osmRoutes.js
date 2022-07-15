export default (state=null,action)=>{
    switch(action.type){
        case 'OSM_ROUTES':
            return action.payload
        default: 
            return state;
    }
}