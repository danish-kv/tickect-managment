import { showToast } from "../utils/showToast.js";
import api from "./api";

export const register = async (email, password, username) => {
  try {
    const response = await api.post("api/register/", {
      email,
      password,
      username,
    });
    // showToast(200, "User registered successfully!");
    return response.data;
  } catch (error) {
    console.error("catch error signup ===>", error);
    console.error("catch  ===>", error.response);
    showToast(
      error.response.status || 400,
      error.response.data.email || "Facing some issue please try later"
    );

    if (error.response && error.response.data) {
      const errorMessages = error.response.data;
      for (let key in errorMessages) {
        if (errorMessages.hasOwnProperty(key)) {
          showToast(400, `${key}: ${errorMessages[key]}`);
          console.error(`${key}: ${errorMessages[key]}`);
        }
      }
    } else {
      showToast(400, "An unexpected error occurred.");
    }

    throw error;
  }
};

export const login = async ({ username, password, role }) => {
  try {
    console.log("login ===> ", username, password, role);

    const res = await api.post("api/login/token/", {
      username,
      password,
      role,
    });
    console.log("res from login ====>", res);

    return res.data;
  } catch (error) {
    console.error("Error in login: ", error);

    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data?.detail;

      if (status === 401) {
        showToast(200, "Data not found given credentials");
      } else {
        showToast("An unexpected error occurred.");
        showToast(status, detail);
      }
    } else {
      showToast("An error occurred");
    }
    throw error;
  }
};

export const logout = async (refresh) => {
  try {
    const res = await api.post("api/logout/", { refresh: refresh });
    return res.data;
  } catch (error) {
    console.log(error);
    showToast("Failed to Logout");
  }
  showToast(200, "Thank You..");
};

export default {
  register,
  login,
  logout,
};