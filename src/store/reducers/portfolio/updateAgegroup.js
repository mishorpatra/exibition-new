export default (state=null,action)=>{
    switch(action.type){
        case 'UPDATE_AGEGROUP':
            return action.payload
        default: 
            return state;
    }
}