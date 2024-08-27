import { combineReducers } from "redux";
import userReducer from "./userReducer";
import accountReducer from "./accountReducer";

const rootReducer = combineReducers({ user: userReducer, account: accountReducer });

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
