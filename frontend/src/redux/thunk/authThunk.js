import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import authService from "../../services/authService";


export const LoginThunk = createAsyncThunk(
  "auth/Login",
  async (data, { rejectWithValue }) => {
    try {
      console.log("payload ====", data);
      const res = await authService.login(data);
      console.log(res);

      localStorage.setItem("access", res.access);
      localStorage.setItem("refresh", res.refresh);
      localStorage.setItem("user", JSON.stringify(res.user)); 
      localStorage.setItem("userID", res.userID);
      return res;
    } catch (error) {
      console.log("Login Thunk error", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const SignupThunk = createAsyncThunk(
  "auth/Signup",
  async (data, { rejectWithValue }) => {
    console.log('============',data);
    
    try {
      const res = await authService.register(data.email, data.password, data.username);
      console.log("sign up res thunk ===", res);

      return res;
    } catch (error) {
      console.log("Singup Thunk error", error);
      return rejectWithValue(error);
    }
  }
);

export const LogoutThunk = createAsyncThunk("auth/Logout", async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    const res = await authService.logout(refresh);
    console.log("Logout thunk ===", res);
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    return res.data;
  } catch (error) {
    console.log("logout Thunk error", error);

    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
    throw error;
  }
});