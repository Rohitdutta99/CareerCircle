import { combineReducers } from "redux";
import authReducer from "./userReducer";
import articleReducer from "./articleReducer";


const rootReducer = combineReducers({
    userState: authReducer,
    articleState: articleReducer,
});

export default rootReducer;