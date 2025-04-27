import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logged: false,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.logged = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.logged = false;
      state.user = null;
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer; 