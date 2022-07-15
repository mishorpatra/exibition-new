export default (state=null,action)=>{
    switch(action.type){
        case 'UPDATE_MOBILE':
            return action.payload
        default: 
            return state;
    }
}