import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
    sessionChecked: false,
    sessionError: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            state.sessionChecked = true;
            state.sessionError = null;
        },
        clearCredentials: (state) => {
            state.userInfo = null;
            state.sessionChecked = true;
            state.sessionError = null;
        },
        setSessionChecked: (state) => {
            state.sessionChecked = true;
        },
        setSessionError: (state, action) => {
            state.sessionChecked = true;
            state.sessionError = action.payload;
        },
    },
});

export const {setCredentials, clearCredentials, setSessionChecked, setSessionError} = authSlice.actions;
export default authSlice.reducer;
