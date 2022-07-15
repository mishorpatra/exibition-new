export default (state=null,action)=>{
    switch(action.type){
        case 'UPDATE_LANGUAGE':
            return action.payload
        default: 
            return state;
    }
}