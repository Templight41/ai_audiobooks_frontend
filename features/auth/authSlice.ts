import { createSlice } from "@reduxjs/toolkit";
// import { persistStore, persistReducer, purgeStoredState } from 'redux-persist'
// import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    token: null,
    username: null,
    email: null,
    imgUrl: null,
    isAuth: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setImgUrl: (state, action) => {
      state.imgUrl = action.payload;
    },
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.imgUrl = action.payload.imgUrl;
      state.isAuth = true;
    },
    logout: (state) => {
      state.token = null;
      state.username = null;
      state.email = null;
      state.imgUrl = null;
      state.isAuth = false;
    },
  },
});

export const { setToken, setUsername, setEmail, setImgUrl, setIsAuth, setUser, logout } =
  authSlice.actions;
export default authSlice.reducer;
