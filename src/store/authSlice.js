import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logged: false,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.logged = false;
      state.user = null;
    },
    setUser: (state, action) => {
      const payload = action.payload;
      state.user = payload?.user || payload;
      state.logged = true;
    }
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;