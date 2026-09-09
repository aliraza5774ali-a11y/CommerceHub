import { configureStore } from "@reduxjs/toolkit";
import uiReducer from './slice/Uislice.js'
import authReducer from '../features/auth/authSlice.js'

export const store = configureStore({
    reducer : {
        ui : uiReducer,
        auth : authReducer
    }
})