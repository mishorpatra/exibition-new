export default (state=null,action)=>{
    switch(action.type){
        case 'RESET_PASSWORD':
            return action.payload
        default: 
            return state;
    }
}