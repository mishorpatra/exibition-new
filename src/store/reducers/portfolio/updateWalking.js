export default (state=null,action)=>{
    switch(action.type){
        case 'UPDATE_WALKING':
            return action.payload
        default: 
            return state;
    }
}