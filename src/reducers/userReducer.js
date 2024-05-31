import { SET_USER } from "../actions/actionType";

const initialState = {
    user: null,
    error: null,
    loading: true, // Add a loading state
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.user,
                error: null,
                loading: false, // Set loading to false once user is set
            };
        case 'SIGN_IN_ERROR':
            return {
                ...state,
                error: action.error,
                loading: false, // Set loading to false on error
            };
        default:
            return state;
    }
};

export default authReducer;
