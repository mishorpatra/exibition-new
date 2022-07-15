export default (state=null,action)=>{
    switch(action.type){
        case 'GLOBAL_NAVIGATION':
            return action.payload
        default: 
            return state;
    }
}