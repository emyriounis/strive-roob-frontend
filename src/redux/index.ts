import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { ReduxStoreType } from "../types/reduxTypes";
import loggedInReducer from "./reducers/loggedInReducer";
import userReducer from "./reducers/userReducer";

const composeThatAlwaysWorks =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const initialState: ReduxStoreType = {
  loggedIn: false,
  user: null,
};

const bigReducer = combineReducers({
  loggedIn: loggedInReducer,
  user: userReducer,
});

const configureStore = createStore(
  bigReducer,
  initialState,
  composeThatAlwaysWorks(applyMiddleware(thunk))
);

export default configureStore;
