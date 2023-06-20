import { createSlice } from "@reduxjs/toolkit";

const initialState = { address: null, isAuthenticated: false, user: null, loading: false };


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserAddress: (state, action) => {
            state.address = action.payload
        },
        login: (state, action) => {

            if (action.payload[1] === 200) {
                state.isAuthenticated = true;
                state.user = action.payload
            }
        },
        logout: (state) => {
            state.isAuthenticated = initialState.isAuthenticated;
            state.user = initialState.user;
        },
        setUser: (state, action) => { // new action to set user data
            console.log(action.payload);
            state.user = action.payload;
        },
    }
});

export const { setUserAddress, login, logout, setUser } = authSlice.actions;


export default authSlice.reducer;