import { createStore, applyMiddleware } from "redux";
import {thunk} from "redux-thunk"; // Import thunk as a named export
import rootReducer from "../reducers"; // Ensure the path to your rootReducer is correct

const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Apply middleware correctly
);

export default store;
