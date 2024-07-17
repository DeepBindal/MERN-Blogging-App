// authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const storedUser = JSON.parse(localStorage.getItem('user')) || {};
const storedIsAuthenticated = !!localStorage.getItem('isAuthenticated');

const initialState = {
    user: storedUser,
    isAuthenticated: storedIsAuthenticated,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('isAuthenticated', 'true');
        },
        logoutUser: (state) => {
            state.user = {};
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        }
    }
})

export const { loginUser, logoutUser } = authSlice.actions

export default authSlice.reducer
