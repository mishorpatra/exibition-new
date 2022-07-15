export default (state=null,action)=>{
    switch(action.type){
        case 'SAVE_ADDRESS':
            return action.payload
        default: 
            return state;
    }
}