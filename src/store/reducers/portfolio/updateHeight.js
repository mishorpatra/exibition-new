export default (state=null,action)=>{
    switch(action.type){
        case 'UPDATE_HEIGHT':
            return action.payload
        default: 
            return state;
    }
}