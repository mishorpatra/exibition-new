export default (state=null,action)=>{
    switch(action.type){
        case 'UPDATE_VISION':
            return action.payload
        default: 
            return state;
    }
}