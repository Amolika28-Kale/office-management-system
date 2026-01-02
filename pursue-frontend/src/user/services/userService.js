import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/user";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getMyProfile = () =>
  axios.get(`${API}/me`, authHeader());

export const updateMyProfile = (data) =>
  axios.put(`${API}/me`, data, authHeader());

export const changePassword = (data) =>
  axios.put(`${API}/change-password`, data, authHeader());
