import {SET_LOADING_STATUS} from '../actions/actionType';

export const initState = {
    loading: false,
};


const articleReducer = (state = initState, action) => {
    switch (Selection.type) {
        case SET_LOADING_STATUS: 
            return {
                ...state, 
                loading: action.state,
            }
        default:
            return state;
    }
};

export default articleReducer;