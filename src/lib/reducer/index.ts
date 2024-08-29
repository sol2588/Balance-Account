import { combineReducers } from "redux";
import userReducer from "./userReducer";
import accountReducer from "./accountReducer";
import modalReducer from "./modalReducer";

const rootReducer = combineReducers({ user: userReducer, account: accountReducer, modal: modalReducer });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
