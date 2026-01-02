import axios from "axios";

const API = "https://office-management-system-muks.onrender.com/api/admin/settings";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getAdminProfile = () =>
  axios.get(`${API}/profile`, authHeader());

export const updateAdminProfile = (data) =>
  axios.put(`${API}/profile`, data, authHeader());

export const changeAdminPassword = (data) =>
  axios.put(`${API}/change-password`, data, authHeader());

export const getAdminSettings = () =>
  axios.get(`${API}/settings`, authHeader());

export const updateAdminSettings = (data) =>
  axios.put(`${API}/settings`, data, authHeader());
