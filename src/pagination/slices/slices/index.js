import {combineReducers} from "@reduxjs/toolkit";
import userReducer from "./user";
import {apis} from "@/store/apis"
import { instituteApi } from "@/store/apis/instituteApi";


export const rootReducer = combineReducers({
    user: userReducer,
    [apis.reducerPath]: apis.reducer,
    [instituteApi.reducerPath]: instituteApi.reducer,

})