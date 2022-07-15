export default (state=null,action)=>{
    switch(action.type){
        case 'UPDATE_NAME':
            return action.payload
        default: 
            return state;
    }
}